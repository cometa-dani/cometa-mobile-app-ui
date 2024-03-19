import { FC, useMemo, useState } from 'react';
import Modal from 'react-native-modal';
import { SafeAreaView, StyleSheet, Pressable, Image as HeaderImage } from 'react-native';
import { Text, View } from '../../components/Themed';
import { router, useGlobalSearchParams } from 'expo-router';
import { useInfiteQueryGetUsersWhoLikedSameEventByID } from '../../queries/targetUser/eventHooks';
import { Image } from 'expo-image';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { AppButton } from '../../components/buttons/buttons';
import { StatusBar } from 'expo-status-bar';
import { useInfiniteQueryGetLoggedInUserNewestFriends, useMutationAcceptFriendshipInvitation, useMutationCancelFriendshipInvitation, useMutationSentFriendshipInvitation } from '../../queries/loggedInUser/friendshipHooks';
import { useCometaStore } from '../../store/cometaStore';
import { FontAwesome } from '@expo/vector-icons';
import { GetBasicUserProfile } from '../../models/User';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { defaultImgPlaceholder, nodeEnv } from '../../constants/vars';
import { FlashList } from '@shopify/flash-list';
import { gray_200, gray_300, gray_500 } from '../../constants/colors';
import { useQueryGetLoggedInUserProfileByUid } from '../../queries/loggedInUser/userProfileHooks';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../../queries/queryKeys';
import { GetLikedEventsForBucketListWithPagination } from '../../models/LikedEvent';
import { If } from '../../components/utils';
import { SkeletonLoaderList } from '../(app)/bucketList';
import uuid from 'react-native-uuid';
import { writeToRealTimeDB } from '../../firebase/writeToRealTimeDB';


type Message = { message: string };

const messageSchemmaValidation = Yup.object<Message>({
  message: Yup.string().required()
});


export default function MatchedEventsScreen(): JSX.Element {
  // client state
  const loggedInUserUuid = useCometaStore(state => state.uid);
  const setToggleModal = useCometaStore(state => state.setToggleModal);
  const toggleModal = useCometaStore(state => state.toggleModal);

  const setTargetUserAsFriendShipSender = useCometaStore(state => state.setIncommginFriendshipSender);
  const targetUserAsFriendshipSender = useCometaStore(state => state.incommginFriendshipSender);

  // queries
  const { data: loggedInUserProfile } = useQueryGetLoggedInUserProfileByUid(loggedInUserUuid);
  const urlParams = useGlobalSearchParams<{ eventId: string, eventIndex: string }>();

  // cached data
  const queryClient = useQueryClient();
  const bucketListCahedData = queryClient.getQueryData<InfiniteData<GetLikedEventsForBucketListWithPagination, number>>([QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST_BY_LOGGED_IN_USER_WITH_PAGINATION]);

  const eventByIdCachedData = bucketListCahedData?.pages.flatMap(page => page?.events)[+urlParams.eventIndex] ?? null;

  // fetching data
  const newPeopleTargetUsers = useInfiteQueryGetUsersWhoLikedSameEventByID(+urlParams.eventId);
  const newestFriendsTargetUsers = useInfiniteQueryGetLoggedInUserNewestFriends();

  const memoizedNewPeopleTargetUsers =
    useMemo(() => newPeopleTargetUsers.data?.pages.flatMap(page => page?.usersWhoLikedEvent) || [], [newPeopleTargetUsers.data?.pages]);
  const memoizedNewestFriendsTargetUsers =
    useMemo(() => newestFriendsTargetUsers.data?.pages.flatMap(page => page?.friendships) || [], [newestFriendsTargetUsers.data?.pages]);

  // toggling tabs
  const [toggleTabs, setToggleTabs] = useState(false); // shuould be store on phone

  // mutations
  const mutationSentFriendship = useMutationSentFriendshipInvitation();
  const mutationAcceptFriendship = useMutationAcceptFriendshipInvitation();
  const mutationCancelFriendship = useMutationCancelFriendshipInvitation();

  /**
  *
  * @description from a sender user, accepts friendship with status 'ACCEPTED'
  * @param {GetBasicUserProfile} targetUserAsSender the sender of the friendship invitation
  */
  const acceptPendingInvitation = (targetUserAsSender: GetBasicUserProfile) => {
    setTargetUserAsFriendShipSender(targetUserAsSender);
    setTimeout(() => setToggleModal(), 100);
    const friendshipID = targetUserAsSender.outgoingFriendships[0]?.id;
    mutationAcceptFriendship.mutate(friendshipID); // set status to 'ACCEPTED' and create chat uuid
  };

  /**
  *
  * @description for a receiver user, sends a friendship invitation with status 'PENDING'
  * @param {GetBasicUserProfile} targetUserAsReceiver the receiver of the friendship invitation
  */
  const sentFriendshipInvitation = (targetUserAsReceiver: GetBasicUserProfile): void => {
    mutationSentFriendship.mutate(targetUserAsReceiver.id);
  };

  /**
  *
  * @description cancels a friendship invitation with status 'PENDING'
  * @param {GetBasicUserProfile} targetUserAsReceiver the receiver of the friendship invitation
  */
  const cancelFriendshipInvitation = (targetUserAsReceiver: GetBasicUserProfile): void => {
    mutationCancelFriendship.mutate(targetUserAsReceiver.id);
  };

  /**
   *
   * @description start chat with new friend on modal open
   */
  const handleSentMessageToTargetUserAsNewFriend =
    async (values: Message, actions: FormikHelpers<Message>): Promise<void> => {
      const messagePayload = {
        _id: uuid.v4().toString(),
        text: values.message,
        createdAt: new Date().toString(),
        user: {
          _id: loggedInUserUuid,
        }
      };
      try {
        if (mutationAcceptFriendship.data?.chatuuid && loggedInUserProfile && targetUserAsFriendshipSender) {
          const { chatuuid } = mutationAcceptFriendship.data;
          await writeToRealTimeDB(
            chatuuid,
            messagePayload,
            loggedInUserProfile,
            targetUserAsFriendshipSender
          );
          router.push(`/chat/${targetUserAsFriendshipSender?.uid}`);
        }
        else {
          // TODO:
          // should fetch the chatuuid from the server again
        }
        actions.resetForm();
        setToggleModal();
        actions.setSubmitting(true);
      }
      catch (error) {
        // console.log(error);
      }
    };


  const TabsHeader: FC = () => (
    <View style={[styles.header, { paddingHorizontal: 18, paddingTop: 20 }]}>
      <HeaderImage
        style={styles.imgHeader}
        source={{ uri: eventByIdCachedData?.photos[0]?.url }}
      />

      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setToggleTabs(prev => !prev)}>
          <Text style={[styles.tab, toggleTabs && { ...styles.tabActive, color: '#83C9DD' }]}>Friends</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setToggleTabs(prev => !prev)}>
          <Text style={[styles.tab, !toggleTabs && { ...styles.tabActive, color: '#E44063' }]}>New People</Text>
        </TouchableOpacity>
      </View>
    </View>
  );


  const MeetNewPeopleFlashList: FC = () => (
    <If
      condition={newPeopleTargetUsers.isLoading}
      render={(
        <SkeletonLoaderList height={80} gap={26} />
      )}
      elseRender={(
        <If
          condition={!newPeopleTargetUsers.data?.pages[0]?.totalUsers}
          render={(
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ ...styles.tab, color: gray_300 }}>No new people</Text>
            </View>
          )}
          elseRender={(
            <FlashList
              estimatedItemSize={100}
              ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
              contentContainerStyle={styles.flatList}
              showsVerticalScrollIndicator={true}
              data={memoizedNewPeopleTargetUsers}
              renderItem={({ item: { user: targetUser } }) => {
                const isReceiver: boolean = targetUser?.incomingFriendships[0]?.status === 'PENDING';
                const isSender: boolean = targetUser?.outgoingFriendships[0]?.status === 'PENDING';

                return (
                  <View key={targetUser.id} style={styles.user}>
                    <Pressable onPress={() => router.push(`/targetUserProfile/${targetUser.uid}?isFriend=false&eventId=${urlParams.eventId}`)}>
                      <View style={styles.avatarContainer}>
                        <Image
                          style={styles.userAvatar}
                          placeholder={{ thumbhash: targetUser?.photos[0]?.placeholder }}
                          source={{ uri: targetUser?.photos[0]?.url ?? defaultImgPlaceholder }}
                        />

                        <View style={styles.textContainer}>
                          <Text
                            style={styles.userName}
                            numberOfLines={1}
                            ellipsizeMode='tail'
                          >
                            {targetUser.username}
                          </Text>
                          <Text>online</Text>
                        </View>
                      </View>
                    </Pressable>

                    {isSender && (
                      <AppButton
                        onPress={() => acceptPendingInvitation(targetUser)}
                        text={nodeEnv === 'development' ? 'JOIN 2' : 'JOIN'}
                        btnColor='black'
                      />
                    )}
                    {!isReceiver && !isSender && (
                      <AppButton
                        onPress={() => sentFriendshipInvitation(targetUser)}
                        text="JOIN"
                        btnColor='black'
                      />
                    )}
                    {isReceiver && (
                      <AppButton
                        onPress={() => cancelFriendshipInvitation(targetUser)}
                        text="PENDING"
                        btnColor='blue'
                      />
                    )}

                  </View>
                );
              }}
            />
          )}
        />
      )}
    />
  );


  const FriendsFlashList: FC = () => (
    <If
      condition={newestFriendsTargetUsers.isLoading}
      render={(
        <SkeletonLoaderList height={80} gap={26} />
      )}
      elseRender={(
        <If
          condition={!newestFriendsTargetUsers.data?.pages[0]?.totalFriendships}
          render={(
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ ...styles.tab, color: gray_300 }}>No friends</Text>
            </View>
          )}
          elseRender={(
            <FlashList
              estimatedItemSize={100}
              ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
              contentContainerStyle={styles.flatList}
              showsVerticalScrollIndicator={true}
              data={memoizedNewestFriendsTargetUsers}
              renderItem={({ item }) => {
                return (
                  <View key={item?.friend?.id} style={styles.user}>
                    <Pressable onPress={() => router.push(`/targetUserProfile/${item?.friend?.uid}?isFriend=true&eventId=${urlParams.eventId}`)}>
                      <View style={styles.avatarContainer}>
                        <Image
                          style={styles.userAvatar}
                          placeholder={{ thumbhash: item?.friend?.photos[0]?.placeholder ?? '' }}
                          source={{ uri: item?.friend?.photos[0]?.url ?? '' }}
                        />

                        <View style={styles.textContainer}>
                          <Text
                            style={styles.userName}
                            numberOfLines={1}
                            ellipsizeMode='tail'
                          >
                            {item?.friend?.username}
                          </Text>
                          <Text>online</Text>
                        </View>
                      </View>
                    </Pressable>

                    <AppButton
                      onPress={() => router.push(`/chat/${item?.friend?.uid}`)}
                      text="CHAT"
                      btnColor='gray'
                    />
                  </View>
                );
              }}
            />
          )}
        />
      )}
    />
  );


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="transparent" translucent={true} style={'auto'} />

      <View style={styles.screenContainer}>

        <Modal isVisible={toggleModal}>
          <View style={modalStyles.modalView}>
            <View style={modalStyles.avatarMatchContainer}>
              <Image
                style={modalStyles.avatarMatch}
                placeholder={{ thumbhash: loggedInUserProfile?.photos[0]?.placeholder }}
                source={{ uri: loggedInUserProfile?.photos[0]?.url }}
              />

              {targetUserAsFriendshipSender?.photos?.[0]?.url && (
                <Image
                  style={modalStyles.avatarMatch}
                  placeholder={{ thumbhash: targetUserAsFriendshipSender.photos[0]?.placeholder }}
                  source={{ uri: targetUserAsFriendshipSender.photos[0]?.url }}
                />
              )}
            </View>

            <View>
              <Text style={modalStyles.modalText}>It&apos;s a match!</Text>
              <Text style={modalStyles.modalText}>You have a new friend</Text>
            </View>

            <Formik
              validationSchema={messageSchemmaValidation}
              initialValues={{ message: '' }}
              onSubmit={handleSentMessageToTargetUserAsNewFriend}
            >
              {({ handleSubmit, handleBlur, handleChange, values, isSubmitting }) => (
                <View style={modalStyles.inputContainer}>
                  <TextInput
                    numberOfLines={1}
                    style={modalStyles.input}
                    onChangeText={handleChange('message')}
                    onBlur={handleBlur('message')}
                    value={values.message}
                    placeholder={`Mesage ${targetUserAsFriendshipSender?.username} to join together`}
                  />
                  <Pressable
                    disabled={isSubmitting}
                    style={modalStyles.btnSubmit}
                    onPress={() => handleSubmit()}
                  >
                    <FontAwesome style={{ fontSize: 26, color: '#fff' }} name='send' />
                  </Pressable>
                </View>
              )}
            </Formik>

            <Pressable
              style={modalStyles.iconButton}
              onPress={() => setToggleModal()}
            >
              <FontAwesome style={modalStyles.icon} name='times-circle' />
            </Pressable>
          </View>
        </Modal>

        <TabsHeader />

        <If
          condition={toggleTabs}
          render={(
            <FriendsFlashList />
          )}
          elseRender={(
            <MeetNewPeopleFlashList />
          )}
        />
      </View>
    </SafeAreaView>
  );
}


const modalStyles = StyleSheet.create({

  avatarMatch: {
    aspectRatio: 1,
    borderColor: '#eee',
    borderRadius: 100,
    borderWidth: 2,
    height: 110
  },

  avatarMatchContainer: {
    flexDirection: 'row',
    gap: -28
  },

  btnSubmit: {
    backgroundColor: '#a22bfa',
    borderRadius: 10,
    elevation: 2,
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: '#171717',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },

  icon: {
    fontSize: 34
  },

  iconButton: {
    position: 'absolute',
    right: 28,
    top: 24
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 50,
    elevation: 2,
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#171717',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },

  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    marginTop: 10
  },


  modalText: {
    fontSize: 18,
    textAlign: 'center',
  },

  modalView: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 3,
    gap: 16,
    paddingHorizontal: 28,
    paddingVertical: 24,
    shadowColor: '#171717',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 0.4,
    width: '100%'
  }
});


const styles = StyleSheet.create({
  avatarContainer: {
    flexDirection: 'row',
    gap: 10,
  },

  flatList: {
    paddingHorizontal: 20,
    paddingVertical: 26
  },

  header: {
    gap: 16
  },

  imgHeader: {
    borderRadius: 20,
    objectFit: 'cover',
    height: 180,
    width: 'auto',
  },

  screenContainer: {
    flex: 1,
  },

  tab: {
    fontSize: 17,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 2,
    color: gray_500
  },

  tabActive: {
    borderBottomWidth: 2,
    borderColor: gray_200
  },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6
  },

  textContainer: {
    gap: 2,
    justifyContent: 'center'
  },

  user: {
    alignItems: 'center',
    borderRadius: 40,
    elevation: 3,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 22,
    paddingVertical: 18,
    shadowColor: '#171717',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 1
  },

  userAvatar: {
    aspectRatio: 1,
    borderRadius: 50,
    width: 50
  },

  userName: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'capitalize',
    width: 110
  }
});
