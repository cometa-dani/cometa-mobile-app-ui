import { FC, useState } from 'react';
import { SafeAreaView, StyleSheet, Modal, View as DefaultView, Pressable } from 'react-native';
import { Text, View } from '../components/Themed';
import { router, useLocalSearchParams } from 'expo-router';
import { useQueryGetEventById, useInfiteQueryGetUsersWhoLikedEventByID } from '../queries/eventHooks';
import { Image } from 'react-native';
import { FlatList, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { AppButton } from '../components/buttons/buttons';
import { StatusBar } from 'expo-status-bar';
import { useInfiniteQueryGetNewestFriends, useMutationAcceptFriendshipInvitation, useMutationCancelFriendshipInvitation, useMutationSentFriendshipInvitation } from '../queries/friendshipHooks';
import Animated, { SlideInLeft, SlideInRight, SlideOutLeft, SlideOutRight } from 'react-native-reanimated';
import { useCometaStore } from '../store/cometaStore';
import { useQueryGetUserProfileByUid } from '../queries/userHooks';
import { FontAwesome } from '@expo/vector-icons';
import { GetBasicUserProfile } from '../models/User';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { IMessage, } from 'react-native-gifted-chat';
import { nodeEnv } from '../constants/vars';


type Message = { message: string };

const messageSchemmaValidation = Yup.object<Message>({
  message: Yup.string().required()
});


export default function ConnectWithPeopleScreen(): JSX.Element {
  const uid = useCometaStore(state => state.uid);

  // toggling modal & tabs
  const [toggleModal, setToggleModal] = useState(false);
  const [toggleTabs, setToggleTabs] = useState(false);

  // queries
  const { data: userProfile } = useQueryGetUserProfileByUid(uid);
  const urlParam = useLocalSearchParams()['connectWithPeople'];
  const eventByIdRes = useQueryGetEventById(+urlParam);
  const newPeopleRes = useInfiteQueryGetUsersWhoLikedEventByID(+urlParam);
  const newestFriendsRes = useInfiniteQueryGetNewestFriends();

  // mutations
  const [incommginFriendshipSender, setIncommginFriendshipSender] = useState({} as GetBasicUserProfile);
  const mutationSentFriendship = useMutationSentFriendshipInvitation();
  const mutationAcceptFriendship = useMutationAcceptFriendshipInvitation();
  const mutationCancelFriendship = useMutationCancelFriendshipInvitation();

  /**
  * 
  * @description from a sender user, accepts friendship with status 'ACCEPTED'
  * @param {GetBasicUserProfile} sender the sender of the friendship invitation
  */
  const handleUserIsSender = (sender: GetBasicUserProfile): void => {
    setIncommginFriendshipSender(sender);
    setTimeout(() => setToggleModal(true), 100);
    const friendshipID = sender.outgoingFriendships[0].id;
    mutationAcceptFriendship.mutate(friendshipID);
  };

  /**
  * 
  * @description for a receiver user, sends a friendship invitation with status 'PENDING'
  * @param {GetBasicUserProfile} receiver the receiver of the friendship invitation
  */
  const handleUserIsNietherSenderNorReceiver = (receiver: GetBasicUserProfile): void => {
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
          avatar: userProfile?.avatar,
          name: userProfile?.username,
          _id: userProfile?.id as number,
        }
      };
      actions.resetForm();
      setToggleModal(false);
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
      <Image style={styles.imgHeader} source={{ uri: eventByIdRes.data?.mediaUrl }} />

      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setToggleTabs(prev => !prev)}>
          <Text style={[styles.tab, toggleTabs && styles.tabActive]}>Friends</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setToggleTabs(prev => !prev)}>
          <Text style={[styles.tab, !toggleTabs && styles.tabActive]}>New People</Text>
        </TouchableOpacity>
      </View>
    </View>
  );


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="transparent" translucent={true} style={'auto'} />

      <View style={styles.screenContainer}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={toggleModal}
        >
          <DefaultView style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
              <View style={modalStyles.avatarMatchContainer}>
                <Image style={modalStyles.avatarMatch} source={{ uri: userProfile?.avatar }} />
                {incommginFriendshipSender?.avatar && (
                  <Image style={modalStyles.avatarMatch} source={{ uri: incommginFriendshipSender.avatar }} />
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
                onPress={() => setToggleModal(false)}
              >
                <FontAwesome style={modalStyles.icon} name='times-circle' />
              </Pressable>
            </View>
          </DefaultView>
        </Modal>

        <TabsHeader />

        {/* FRIENDS */}
        {toggleTabs && (
          newestFriendsRes.isSuccess && (
            <Animated.View entering={SlideInLeft} exiting={SlideOutRight}>
              <FlatList
                contentContainerStyle={styles.flatList}
                data={newestFriendsRes.data?.pages.flatMap(page => page?.friendships) || []}
                renderItem={({ item: { friend }, index }) => {
                  return (
                    <View key={index} style={styles.user}>
                      <View style={styles.avatarContainer}>
                        <Pressable onPress={() => router.push(`/newPeopleProfile/${friend.uid}?isFriend=true`)}>
                          <Image style={styles.userAvatar} source={{ uri: friend?.avatar }} />
                        </Pressable>

                        <View style={styles.textContainer}>
                          <Text style={styles.userName}>{friend?.username}</Text>
                          <Text>online</Text>
                        </View>
                      </View>

                      <AppButton
                        onPress={() => router.push(`/chat/${friend.id}`)}
                        text="CHAT"
                        btnColor='gray'
                      />
                    </View>
                  );
                }}
              />
            </Animated.View>
          )
        )}

        {/* NEW PEOPLE */}
        {!toggleTabs && (
          newPeopleRes.isSuccess && (
            <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
              <FlatList
                // ListHeaderComponent={}
                contentContainerStyle={styles.flatList}
                data={newPeopleRes.data?.pages.flatMap(page => page.usersWhoLikedEvent)}
                renderItem={({ item: { user }, index }) => {
                  const isReceiver: boolean = user?.incomingFriendships[0]?.status === 'PENDING';
                  const isSender: boolean = user?.outgoingFriendships[0]?.status === 'PENDING';

                  return (
                    <View key={index} style={styles.user}>
                      <View style={styles.avatarContainer}>
                        <Pressable onPress={() => router.push(`/newPeopleProfile/${user.uid}?isFriend=false`)}>
                          <Image style={styles.userAvatar} source={{ uri: user.avatar }} />
                        </Pressable>

                        <View style={styles.textContainer}>
                          <Text style={styles.userName}>{user.username}</Text>
                          <Text>online</Text>
                        </View>
                      </View>

                      {isReceiver && (
                        <AppButton
                          onPress={() => handleCancelFriendshipInvitation(user)}
                          text="PENDING"
                          btnColor='blue'
                        />
                      )}
                      {isSender && (
                        <AppButton
                          onPress={() => handleUserIsSender(user)}
                          text={nodeEnv === 'development' ? 'JOIN 2' : 'JOIN'}
                          btnColor='black'
                        />
                      )}
                      {!isReceiver && !isSender && (
                        <AppButton
                          onPress={() => handleUserIsNietherSenderNorReceiver(user)}
                          text="JOIN"
                          btnColor='black'
                        />
                      )}
                    </View>
                  );
                }}
              />
            </Animated.View>
          )
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

  centeredView: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    padding: 20,
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
    gap: 14,
  },

  flatList: { gap: 26, paddingHorizontal: 18, paddingVertical: 28 },

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
    fontSize: 17.6,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 2
  },

  tabActive: {
    borderBottomWidth: 2,
    borderColor: 'gray'
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
    gap: 18,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
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
    fontSize: 17,
    fontWeight: '700',
    textTransform: 'capitalize'
  }
});
