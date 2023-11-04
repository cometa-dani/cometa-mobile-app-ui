import { FC, useState } from 'react';
import { SafeAreaView, StyleSheet, Modal, View as DefaultView, Pressable } from 'react-native';
import { Text, View } from '../components/Themed';
import { router, useLocalSearchParams } from 'expo-router';
import { useQueryGetEventById, useInfiteQueryGetUsersWhoLikedEventByID } from '../queries/eventHooks';
import { Image } from 'react-native';
import { FlatList, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { CoButton } from '../components/buttons/buttons';
import { StatusBar } from 'expo-status-bar';
import { useInfiniteQueryGetNewestFriends } from '../queries/friendshipHooks';
import Animated, { SlideInLeft, SlideInRight, SlideOutLeft, SlideOutRight } from 'react-native-reanimated';
import { useCometaStore } from '../store/cometaStore';
import { useQueryGetUserInfo } from '../queries/userHooks';
import { Formik } from 'formik';
import { FontAwesome } from '@expo/vector-icons';
import { UsersWhoLikedEvent } from '../models/User';


export default function ConnectWithPeopleScreen(): JSX.Element {
  const uid = useCometaStore(state => state.uid);
  const { data: userProfile } = useQueryGetUserInfo(uid);
  const urlParam = useLocalSearchParams()['connectWithPeople'];
  const eventByIdRes = useQueryGetEventById(+urlParam);
  const usersWhoLikedSameEventRes = useInfiteQueryGetUsersWhoLikedEventByID(+urlParam);
  const newestFriendsRes = useInfiniteQueryGetNewestFriends();
  const [toggleModal, setToggleModal] = useState(false);
  const [toggleTabs, setToggleTabs] = useState(false);
  const [incommginFriendShip, setIncommginFriendShip] = useState({} as UsersWhoLikedEvent);

  const handleIncommingFriendShip = (incommingUser: UsersWhoLikedEvent): void => {
    setIncommginFriendShip(incommingUser);
    setTimeout(() => setToggleModal(true), 100);
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
                {incommginFriendShip?.user?.avatar && (
                  <Image style={modalStyles.avatarMatch} source={{ uri: incommginFriendShip.user.avatar }} />
                )}
              </View>

              <View>
                <Text style={modalStyles.modalText}>It&apos;s as match!</Text>
                <Text style={modalStyles.modalText}>You have a new friend</Text>
              </View>

              <Formik initialValues={{ message: '' }} onSubmit={(values) => console.log(values)}>
                {({ handleBlur, handleChange, values }) => (
                  <TextInput
                    numberOfLines={1}
                    style={modalStyles.input}
                    onChangeText={handleChange('message')}
                    onBlur={handleBlur('message')}
                    value={values.message}
                    placeholder={`Mesage ${incommginFriendShip.user.username} to join together ${eventByIdRes.data?.name.split(' ').slice(0, 4).join(' ')}`}
                    secureTextEntry={true}
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
                renderItem={({ item }) => {
                  return (
                    <View key={item.id} style={styles.user}>
                      <View style={styles.avatarContainer}>
                        <Image style={styles.userAvatar} source={{ uri: item?.friend?.avatar }} />

                        <View style={styles.textContainer}>
                          <Text style={styles.userName}>{item?.friend?.username}</Text>
                          <Text>online</Text>
                        </View>
                      </View>

                      <CoButton
                        onPress={() => router.push('/chat')}
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
          usersWhoLikedSameEventRes.isSuccess && (
            <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>

              <FlatList
                // ListHeaderComponent={}
                contentContainerStyle={styles.flatList}
                data={usersWhoLikedSameEventRes.data?.pages.flatMap(users => users.usersWhoLikedEvent)}
                renderItem={({ item }) => {
                  const hasIcommingFriendShip: boolean = item.user?.incomingFriendships[0]?.status === 'PENDING';
                  const hasSentInvitation: boolean = item.user?.outgoingFriendships[0]?.status === 'PENDING';

                  return (
                    <View key={item.id} style={styles.user}>
                      <View style={styles.avatarContainer}>
                        <Image style={styles.userAvatar} source={{ uri: item.user.avatar }} />

                        <View style={styles.textContainer}>
                          <Text style={styles.userName}>{item.user.username}</Text>
                          <Text>online</Text>
                        </View>
                      </View>

                      {hasSentInvitation && (
                        <CoButton
                          onPress={() => console.log(hasSentInvitation, 'IS PENDING')}
                          text="PENDING"
                          btnColor='blue'
                        />
                      )}
                      {hasIcommingFriendShip && (
                        <CoButton
                          onPress={() => handleIncommingFriendShip(item)}
                          text="MODAL"
                          btnColor='black'
                        />
                      )}
                      {!hasIcommingFriendShip && !hasSentInvitation && (
                        <CoButton
                          onPress={() => console.log(hasIcommingFriendShip, 'SENT INVITATION')}
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
    height: 116
  },
  avatarMatchContainer: {
    flexDirection: 'row',
    gap: -30
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
    // textOverflow: 'show',
    // textOverflow: '',

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
