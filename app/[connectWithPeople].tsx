import { FC, useState } from 'react';
import { SafeAreaView, StyleSheet, Modal, View as DefaultView, Pressable } from 'react-native';
import { Text, View } from '../components/Themed';
import { router, useLocalSearchParams } from 'expo-router';
import { useQueryGetEventById, useInfiteQueryGetUsersWhoLikedEventByID } from '../queries/eventHooks';
import { Image } from 'react-native';
import { FlatList, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { CoButton } from '../components/buttons/buttons';
import { StatusBar } from 'expo-status-bar';
import { useInfiniteQueryGetNewestFriends, useMutationAcceptFriendshipInvitation, useMutationSentFriendshipInvitation } from '../queries/friendshipHooks';
import Animated, { SlideInLeft, SlideInRight, SlideOutLeft, SlideOutRight } from 'react-native-reanimated';
import { useCometaStore } from '../store/cometaStore';
import { useQueryGetUserInfo } from '../queries/userHooks';
import { FontAwesome } from '@expo/vector-icons';
import { UserRes } from '../models/User';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';


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
  const { data: userProfile } = useQueryGetUserInfo(uid);
  const urlParam = useLocalSearchParams()['connectWithPeople'];
  const eventByIdRes = useQueryGetEventById(+urlParam);
  const newPeopleRes = useInfiteQueryGetUsersWhoLikedEventByID(+urlParam);
  const newestFriendsRes = useInfiniteQueryGetNewestFriends();
  // console.log(urlParam);

  // mutations
  const [incommginFriendShip, setIncommginFriendShip] = useState({} as UserRes);
  const mutationSentFriendship = useMutationSentFriendshipInvitation();
  const mutationAcceptFriendship = useMutationAcceptFriendshipInvitation();

  /**
  * 
  * @description from a sender user, accepts friendship with status 'ACCEPTED'
  */
  const handleUserIsSender = (sender: UserRes): void => {
    setIncommginFriendShip(sender);
    setTimeout(() => setToggleModal(true), 100);
    const friendshipID = sender.outgoingFriendships[0].id;
    mutationAcceptFriendship.mutate(friendshipID);
  };

  /**
  * 
  * @description for a receiver user, sends a friendship invitation with status 'PENDING'
  */
  const handleUserIsNietherSenderNorReceiver = (receiver: UserRes): void => {
    mutationSentFriendship.mutate(receiver.id);
  };


  const handleMessageNewFriend =
    async (values: Message, actions: FormikHelpers<Message>): Promise<void> => {
      // start chat with new friend
      // console.log(values);
      actions.resetForm();
      actions.setSubmitting(false);
      router.push(`/chat/${incommginFriendShip.id}`);
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
                {incommginFriendShip?.avatar && (
                  <Image style={modalStyles.avatarMatch} source={{ uri: incommginFriendShip.avatar }} />
                )}
              </View>

              <View>
                <Text style={modalStyles.modalText}>It&apos;s as match!</Text>
                <Text style={modalStyles.modalText}>You have a new friend</Text>
              </View>

              <Formik
                validationSchema={messageSchemmaValidation}
                initialValues={{ message: '' }}
                onSubmit={handleMessageNewFriend}
              >
                {({ handleBlur, handleChange, values }) => (
                  <TextInput
                    numberOfLines={1}
                    style={modalStyles.input}
                    onChangeText={handleChange('message')}
                    onBlur={handleBlur('message')}
                    value={values.message}
                    placeholder={`Mesage ${incommginFriendShip.username} to join together ${eventByIdRes.data?.name.split(' ').slice(0, 4).join(' ')}`}
                  />
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
                        <Image style={styles.userAvatar} source={{ uri: friend?.avatar }} />

                        <View style={styles.textContainer}>
                          <Text style={styles.userName}>{friend?.username}</Text>
                          <Text>online</Text>
                        </View>
                      </View>

                      <CoButton
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
                        <Image style={styles.userAvatar} source={{ uri: user.avatar }} />

                        <View style={styles.textContainer}>
                          <Text style={styles.userName}>{user.username}</Text>
                          <Text>online</Text>
                        </View>
                      </View>

                      {isReceiver && (
                        <CoButton
                          text="PENDING"
                          btnColor='blue'
                        />
                      )}
                      {isSender && (
                        <CoButton
                          onPress={() => handleUserIsSender(user)}
                          text="JOIN_2"
                          btnColor='black'
                        />
                      )}
                      {!isReceiver && !isSender && (
                        <CoButton
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
    marginTop: 12,
    paddingHorizontal: 28,
    paddingVertical: 14,
    shadowColor: '#171717',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    width: '100%',
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
    fontSize: 20,
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
