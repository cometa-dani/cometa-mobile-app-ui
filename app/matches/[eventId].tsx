import { FC, useReducer, useState } from 'react';
import Modal from 'react-native-modal';
import { SafeAreaView, StyleSheet, Pressable } from 'react-native';
import { Text, View } from '../../components/Themed';
import { router, useGlobalSearchParams } from 'expo-router';
import { useInfiteQueryGetUsersWhoLikedSameEventByID } from '../../queries/eventHooks';
import { Image } from 'expo-image';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { AppButton } from '../../components/buttons/buttons';
import { StatusBar } from 'expo-status-bar';
import { useInfiniteQueryGetNewestFriends, useMutationAcceptFriendshipInvitation, useMutationCancelFriendshipInvitation, useMutationSentFriendshipInvitation } from '../../queries/friendshipHooks';
import Animated, { SlideInLeft, SlideInRight, SlideOutLeft, SlideOutRight } from 'react-native-reanimated';
import { useCometaStore } from '../../store/cometaStore';
import { FontAwesome } from '@expo/vector-icons';
import { GetBasicUserProfile } from '../../models/User';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { IMessage, } from 'react-native-gifted-chat';
import { nodeEnv } from '../../constants/vars';
import { FlashList } from '@shopify/flash-list';
import { gray_200, gray_500 } from '../../constants/colors';
import { useQueryGetUserProfileByUid } from '../../queries/userHooks';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../../queries/queryKeys';
import { GetLikedEventsForBucketListWithPagination } from '../../models/LikedEvent';


type Message = { message: string };

const messageSchemmaValidation = Yup.object<Message>({
  message: Yup.string().required()
});


export default function MatchesScreen(): JSX.Element {
  // client state
  const uid = useCometaStore(state => state.uid);
  const [toggleModal, setToggleModal] = useReducer((prev) => !prev, false);

  const incommginFriendshipSender = useCometaStore(state => state.incommginFriendshipSender);
  const setIncommginFriendshipSender = useCometaStore(state => state.setIncommginFriendshipSender);

  // queries
  const { data: userProfile } = useQueryGetUserProfileByUid(uid);
  const eventID = useGlobalSearchParams<{ eventId: string }>()['eventId'];

  // cached data
  const queryClient = useQueryClient();
  const queryData = queryClient.getQueryData<InfiniteData<GetLikedEventsForBucketListWithPagination, number>>([QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST_WITH_PAGINATION]);
  const eventById = queryData?.pages.flatMap(page => page?.events).find(event => event.id === +eventID);

  // fetching data
  const newPeopleRes = useInfiteQueryGetUsersWhoLikedSameEventByID(+eventID);
  const newestFriendsRes = useInfiniteQueryGetNewestFriends();

  const allFriends = newestFriendsRes.data?.pages.flatMap(page => page?.friendships) || [];

  // toggling tabs
  const [toggleTabs, setToggleTabs] = useState(true); // shuould be store on phone

  // mutations
  const mutationSentFriendship = useMutationSentFriendshipInvitation();
  const mutationAcceptFriendship = useMutationAcceptFriendshipInvitation();
  const mutationCancelFriendship = useMutationCancelFriendshipInvitation();

  /**
  *
  * @description from a sender user, accepts friendship with status 'ACCEPTED'
  * @param {GetBasicUserProfile} sender the sender of the friendship invitation
  */
  const handleCurrentUserHasAPendingInvitation = (sender: GetBasicUserProfile): void => {
    setIncommginFriendshipSender(sender);
    setTimeout(() => setToggleModal(), 100);
    const friendshipID = sender.outgoingFriendships[0].id;
    mutationAcceptFriendship.mutate(friendshipID);
  };

  /**
  *
  * @description for a receiver user, sends a friendship invitation with status 'PENDING'
  * @param {GetBasicUserProfile} receiver the receiver of the friendship invitation
  */
  const handleCurrentUserHasNoPendingInvitations = (receiver: GetBasicUserProfile): void => {
    mutationSentFriendship.mutate(receiver.id);
  };

  /**
  *
  * @description cancels a friendship invitation with status 'PENDING'
  * @param {GetBasicUserProfile} receiver the receiver of the friendship invitation
  */
  const handleCancelFriendshipInvitation = (receiver: GetBasicUserProfile): void => {
    mutationCancelFriendship.mutate(receiver.id);
  };


  const handleMessageNewFriend =
    async (values: Message, actions: FormikHelpers<Message>): Promise<void> => {
      // start chat with new friend
      const messagePayload: IMessage = {
        _id: Math.round(Math.random() * 1_000_000),
        text: values.message,
        createdAt: new Date(),
        user: {
          avatar: userProfile?.photos[0].url,
          name: userProfile?.username,
          _id: userProfile?.id as number,
        }
      };
      actions.resetForm();
      setToggleModal();
      actions.setSubmitting(false);

      const friendshipID = mutationAcceptFriendship.data?.id;
      if (friendshipID) {
        const subCollection = collection(db, 'chats', `${friendshipID}`, 'messages');
        await addDoc(subCollection, messagePayload);
        router.push(`/chat/${incommginFriendshipSender.id}`);
      }
      else {
        throw new Error('frienship id undefined');
      }
    };


  const TabsHeader: FC = () => (
    <View style={[styles.header, { paddingHorizontal: 18, paddingTop: 26 }]}>
      <Image
        style={styles.imgHeader}
        placeholder={{ thumbhash: eventById?.photos[0]?.placeholder }}
        source={{ uri: eventById?.photos[0]?.url }}
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
      data={newPeopleRes.data?.pages?.flatMap(page => page.usersWhoLikedEvent) ?? []}
      renderItem={({ item: { user: anotherUser }, index }) => {
        const isReceiver: boolean = anotherUser?.incomingFriendships[0]?.status === 'PENDING';
        const isSender: boolean = anotherUser?.outgoingFriendships[0]?.status === 'PENDING';

        return (
          <View key={index} style={styles.user}>
            <Pressable onPress={() => router.push(`/newPeopleProfile/${anotherUser.uid}?isFriend=false`)}>
              <View style={styles.avatarContainer}>
                <Image
                  style={styles.userAvatar}
                  placeholder={{ thumbhash: anotherUser?.photos[0]?.placeholder }}
                  source={{ uri: anotherUser?.photos[0]?.url }}
                />

                <View style={styles.textContainer}>
                  <Text
                    style={styles.userName}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    {anotherUser.username}
                  </Text>
                  <Text>online</Text>
                </View>
              </View>
            </Pressable>

            {isReceiver && (
              <AppButton
                onPress={() => handleCancelFriendshipInvitation(anotherUser)}
                text="PENDING"
                btnColor='blue'
              />
            )}
            {isSender && (
              <AppButton
                onPress={() => handleCurrentUserHasAPendingInvitation(anotherUser)}
                text={nodeEnv === 'development' ? 'JOIN 2' : 'JOIN'}
                btnColor='black'
              />
            )}
            {!isReceiver && !isSender && (
              <AppButton
                onPress={() => handleCurrentUserHasNoPendingInvitations(anotherUser)}
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
      data={allFriends || []}
      renderItem={({ item: { friend }, index }) => {
        return (
          <View key={index} style={styles.user}>
            <Pressable onPress={() => router.push(`/newPeopleProfile/${friend.uid}?isFriend=true`)}>
              <View style={styles.avatarContainer}>
                <Image
                  style={styles.userAvatar}
                  placeholder={{ thumbhash: friend?.photos[0]?.placeholder }}
                  source={{ uri: friend?.photos[0]?.url }}
                />

                <View style={styles.textContainer}>
                  <Text
                    style={styles.userName}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    {friend?.username}
                  </Text>
                  <Text>online</Text>
                </View>
              </View>
            </Pressable>

            <AppButton
              onPress={() => router.push(`/chat/${friend.id}`)}
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
                placeholder={{ thumbhash: userProfile?.photos[0]?.placeholder }}
                source={{ uri: userProfile?.photos[0]?.url }}
              />

              {incommginFriendshipSender?.photos?.[0]?.url && (
                <Image
                  style={modalStyles.avatarMatch}
                  placeholder={{ thumbhash: incommginFriendshipSender.photos[0]?.placeholder }}
                  source={{ uri: incommginFriendshipSender.photos[0]?.url }}
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
              onSubmit={handleMessageNewFriend}
            >
              {({ handleSubmit, handleBlur, handleChange, values }) => (
                <View style={modalStyles.inputContainer}>
                  <TextInput
                    numberOfLines={1}
                    style={modalStyles.input}
                    onChangeText={handleChange('message')}
                    onBlur={handleBlur('message')}
                    value={values.message}
                    placeholder={`Mesage ${incommginFriendshipSender.username} to join together`}
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
