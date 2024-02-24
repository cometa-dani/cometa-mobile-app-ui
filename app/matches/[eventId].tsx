import { FC, useMemo, useReducer, useState } from 'react';
import Modal from 'react-native-modal';
import { SafeAreaView, StyleSheet, Pressable, Image as StaticImage } from 'react-native';
import { Text, View } from '../../components/Themed';
import { router, useGlobalSearchParams } from 'expo-router';
import { useInfiteQueryGetUsersWhoLikedSameEventByID } from '../../queries/targetUser/eventHooks';
import { Image } from 'expo-image';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { AppButton } from '../../components/buttons/buttons';
import { StatusBar } from 'expo-status-bar';
import { useInfiniteQueryGetLoggedInUserNewestFriends, useMutationAcceptFriendshipInvitation, useMutationCancelFriendshipInvitation, useMutationSentFriendshipInvitation } from '../../queries/loggedInUser/friendshipHooks';
import Animated, { SlideInLeft, SlideInRight, SlideOutLeft, SlideOutRight } from 'react-native-reanimated';
import { useCometaStore } from '../../store/cometaStore';
import { FontAwesome } from '@expo/vector-icons';
import { GetBasicUserProfile } from '../../models/User';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { IMessage, } from 'react-native-gifted-chat';
import { defaultImgPlaceholder, nodeEnv } from '../../constants/vars';
import { FlashList } from '@shopify/flash-list';
import { gray_200, gray_500 } from '../../constants/colors';
import { useQueryGetLoggedInUserProfileByUid } from '../../queries/loggedInUser/userProfileHooks';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../../queries/queryKeys';
import { GetLikedEventsForBucketListWithPagination } from '../../models/LikedEvent';


type Message = { message: string };

const messageSchemmaValidation = Yup.object<Message>({
  message: Yup.string().required()
});


export default function MatchedEventsScreen(): JSX.Element {
  // client state
  const loggedInUserUuid = useCometaStore(state => state.uid);
  const [toggleModal, setToggleModal] = useReducer((prev) => !prev, false);

  const incommginFriendshipSenderForLoggedInUser = useCometaStore(state => state.incommginFriendshipSender);
  const setIncommginFriendshipSenderForLoggedInUser = useCometaStore(state => state.setIncommginFriendshipSender);

  // queries
  const { data: loggedInUserProfile } = useQueryGetLoggedInUserProfileByUid(loggedInUserUuid);
  const eventID = useGlobalSearchParams<{ eventId: string }>()['eventId'];

  // cached data
  const queryClient = useQueryClient();
  const queryData = queryClient.getQueryData<InfiniteData<GetLikedEventsForBucketListWithPagination, number>>([QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST_BY_LOGGED_IN_USER_WITH_PAGINATION]);
  const eventByIdCahed = useMemo(
    () => queryData?.pages.flatMap(page => page?.events).find(event => event.id === +eventID),
    [eventID]
  );

  // fetching data
  const newPeopleTargetUsers = useInfiteQueryGetUsersWhoLikedSameEventByID(+eventID);
  const newestFriendsTargetUsers = useInfiniteQueryGetLoggedInUserNewestFriends();

  const memoizedFriendsList =
    useMemo(() => (newestFriendsTargetUsers.data?.pages.flatMap(page => page?.friendships) ?? []),
      [newestFriendsTargetUsers.data?.pages]
    );
  const memoizedMeetNewPeoplelist =
    useMemo(() => (newPeopleTargetUsers.data?.pages?.flatMap(page => page.usersWhoLikedEvent) ?? []),
      [newPeopleTargetUsers.data?.pages]
    );

  // toggling tabs
  const [toggleTabs, setToggleTabs] = useState(true); // shuould be store on phone

  // mutations
  const mutationSentFriendship = useMutationSentFriendshipInvitation();
  const mutationAcceptFriendship = useMutationAcceptFriendshipInvitation();
  const mutationCancelFriendship = useMutationCancelFriendshipInvitation();

  /**
  *
  * @description from a sender user, accepts friendship with status 'ACCEPTED'
  * @param {GetBasicUserProfile} targetUserAsSender the sender of the friendship invitation
  */
  const handleLoggedInUserHasAPendingInvitation = (targetUserAsSender: GetBasicUserProfile): void => {
    setIncommginFriendshipSenderForLoggedInUser(targetUserAsSender);
    setTimeout(() => setToggleModal(), 100);
    const friendshipID = targetUserAsSender.outgoingFriendships[0].id;
    mutationAcceptFriendship.mutate(friendshipID);
  };

  /**
  *
  * @description for a receiver user, sends a friendship invitation with status 'PENDING'
  * @param {GetBasicUserProfile} targetUserAsReceiver the receiver of the friendship invitation
  */
  const handleLoggedInUserHasNoPendingInvitations = (targetUserAsReceiver: GetBasicUserProfile): void => {
    mutationSentFriendship.mutate(targetUserAsReceiver.id);
  };

  /**
  *
  * @description cancels a friendship invitation with status 'PENDING'
  * @param {GetBasicUserProfile} targetUserAsReceiver the receiver of the friendship invitation
  */
  const handleCancelFriendshipInvitation = (targetUserAsReceiver: GetBasicUserProfile): void => {
    mutationCancelFriendship.mutate(targetUserAsReceiver.id);
  };


  const handleSentMessageToTargetUserAsNewFriend =
    async (values: Message, actions: FormikHelpers<Message>): Promise<void> => {
      // start chat with new friend
      const messagePayload: IMessage = {
        _id: Math.round(Math.random() * 1_000_000),
        text: values.message,
        createdAt: new Date(),
        user: {
          avatar: loggedInUserProfile?.photos[0].url,
          name: loggedInUserProfile?.username,
          _id: loggedInUserProfile?.id as number,
        }
      };
      actions.resetForm();
      setToggleModal();
      actions.setSubmitting(false);

      const friendshipID = mutationAcceptFriendship.data?.id;
      if (friendshipID) {
        const subCollection = collection(db, 'chats', `${friendshipID}`, 'messages');
        await addDoc(subCollection, messagePayload);
        router.push(`/chat/${incommginFriendshipSenderForLoggedInUser.id}`);
      }
      else {
        throw new Error('frienship id undefined');
      }
    };


  const TabsHeader: FC = () => (
    <View style={[styles.header, { paddingHorizontal: 18, paddingTop: 26 }]}>
      <StaticImage
        style={styles.imgHeader}
        source={{ uri: eventByIdCahed?.photos[0]?.url }}
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
    <FlashList
      estimatedItemSize={120}
      ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      contentContainerStyle={styles.flatList}
      showsVerticalScrollIndicator={false}
      data={memoizedMeetNewPeoplelist}
      renderItem={({ item: { user: targetUser } }) => {
        const isReceiver: boolean = targetUser?.incomingFriendships[0]?.status === 'PENDING';
        const isSender: boolean = targetUser?.outgoingFriendships[0]?.status === 'PENDING';

        return (
          <View key={targetUser.id} style={styles.user}>
            <Pressable onPress={() => router.push(`/targetUserProfile/${targetUser.uid}?isFriend=false`)}>
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

            {isReceiver && (
              <AppButton
                onPress={() => handleCancelFriendshipInvitation(targetUser)}
                text="PENDING"
                btnColor='blue'
              />
            )}
            {isSender && (
              <AppButton
                onPress={() => handleLoggedInUserHasAPendingInvitation(targetUser)}
                text={nodeEnv === 'development' ? 'JOIN 2' : 'JOIN'}
                btnColor='black'
              />
            )}
            {!isReceiver && !isSender && (
              <AppButton
                onPress={() => handleLoggedInUserHasNoPendingInvitations(targetUser)}
                text="JOIN"
                btnColor='black'
              />
            )}
          </View>
        );
      }}
    />
  );


  const FriendsFlashList: FC = () => (
    <FlashList
      estimatedItemSize={120}
      ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      contentContainerStyle={styles.flatList}
      showsVerticalScrollIndicator={false}
      data={memoizedFriendsList}
      renderItem={({ item: { friend: targetUser } }) => {
        return (
          <View key={targetUser.id} style={styles.user}>
            <Pressable onPress={() => router.push(`/targetUserProfile/${targetUser.uid}?isFriend=true`)}>
              <View style={styles.avatarContainer}>
                <Image
                  style={styles.userAvatar}
                  placeholder={{ thumbhash: targetUser?.photos[0]?.placeholder }}
                  source={{ uri: targetUser?.photos[0]?.url }}
                />

                <View style={styles.textContainer}>
                  <Text
                    style={styles.userName}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    {targetUser?.username}
                  </Text>
                  <Text>online</Text>
                </View>
              </View>
            </Pressable>

            <AppButton
              onPress={() => router.push(`/chat/${targetUser.id}`)}
              text="CHAT"
              btnColor='gray'
            />
          </View>
        );
      }}
    />
  );


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="transparent" translucent={true} style={'auto'} />

      <View style={styles.screenContainer}>

        {/* MOVE TO A PARENT COMPONENT */}
        <Modal isVisible={toggleModal}>
          <View style={modalStyles.modalView}>
            <View style={modalStyles.avatarMatchContainer}>
              <Image
                style={modalStyles.avatarMatch}
                placeholder={{ thumbhash: loggedInUserProfile?.photos[0]?.placeholder }}
                source={{ uri: loggedInUserProfile?.photos[0]?.url }}
              />

              {incommginFriendshipSenderForLoggedInUser?.photos?.[0]?.url && (
                <Image
                  style={modalStyles.avatarMatch}
                  placeholder={{ thumbhash: incommginFriendshipSenderForLoggedInUser.photos[0]?.placeholder }}
                  source={{ uri: incommginFriendshipSenderForLoggedInUser.photos[0]?.url }}
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
              {({ handleSubmit, handleBlur, handleChange, values }) => (
                <View style={modalStyles.inputContainer}>
                  <TextInput
                    numberOfLines={1}
                    style={modalStyles.input}
                    onChangeText={handleChange('message')}
                    onBlur={handleBlur('message')}
                    value={values.message}
                    placeholder={`Mesage ${incommginFriendshipSenderForLoggedInUser.username} to join together`}
                  />
                  <Pressable
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
        {/* MOVE TO A PARENT COMPONENT */}

        <TabsHeader />

        {/* FRIENDS */}
        {toggleTabs && (
          <Animated.View
            style={{ flex: 1 }}
            entering={SlideInLeft.duration(240)}
            exiting={SlideOutRight.duration(240)}
          >
            {/* flashlist fails to render because is empty on first mount */}
            <FriendsFlashList />
          </Animated.View>
        )}

        {/* NEW PEOPLE */}
        {!toggleTabs && (
          <Animated.View
            style={{ flex: 1 }}
            entering={SlideInRight.duration(240)}
            exiting={SlideOutLeft.duration(240)}
          >
            {/* flashlist fails to render because is empty on first mount */}
            <MeetNewPeopleFlashList />
          </Animated.View>
        )}
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
