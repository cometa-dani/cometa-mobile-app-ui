import { FC, useState } from 'react';
import { SafeAreaView, StyleSheet, Modal, Pressable, View as DefaultView } from 'react-native';
import { Text, View } from '../components/Themed';
import { router, useLocalSearchParams } from 'expo-router';
import { useQueryGetEventById, useInfiteQueryGetUsersWhoLikedEventByID } from '../queries/eventHooks';
import { Image } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { CoButton } from '../components/buttons/buttons';
import { StatusBar } from 'expo-status-bar';
import { useInfiniteQueryGetNewestFriends } from '../queries/friendshipHooks';


interface Props {
  imgUrl?: string
}

export default function ConnectWithPeopleScreen(): JSX.Element {
  const urlParam = useLocalSearchParams()['connectWithPeople'];
  const eventRes = useQueryGetEventById(+urlParam);
  const newestFriendsRes = useInfiniteQueryGetNewestFriends();
  const usersWhoLikedSameEventRes = useInfiteQueryGetUsersWhoLikedEventByID(+urlParam);
  // const {data} = useInfi
  console.log(newestFriendsRes.data);
  const [toggleModal, setToggleModal] = useState(false);
  const [toggleTabs, setToggleTabs] = useState(true);

  const TabsHeader: FC<Props> = ({ imgUrl }) => (
    <View style={[styles.header, { paddingHorizontal: 18, paddingTop: 26 }]}>
      <Image style={styles.imgHeader} source={{ uri: imgUrl }} />

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
  // console.log(urlParam);
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
              <Text style={modalStyles.modalText}>Hello World!</Text>
              <Pressable
                style={[modalStyles.button, modalStyles.buttonClose]}
                onPress={() => setToggleModal(false)}
              >
                <Text style={modalStyles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </DefaultView>
        </Modal>

        <TabsHeader imgUrl={eventRes.data?.mediaUrl} />

        {/* FRIENDS */}
        {toggleTabs && (
          newestFriendsRes.isSuccess && (
            <FlatList
              contentContainerStyle={{ gap: 26, paddingHorizontal: 18, paddingVertical: 28 }}
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
          )
        )}

        {/* NEW PEOPLE */}
        {!toggleTabs && (
          usersWhoLikedSameEventRes.isSuccess && (
            <FlatList
              // ListHeaderComponent={}
              contentContainerStyle={{ gap: 26, paddingHorizontal: 18, paddingVertical: 28 }}
              data={usersWhoLikedSameEventRes.data?.pages.flatMap(users => users.usersWhoLikedEvent)}
              renderItem={({ item }) => {
                const hasIcommingFriendShip: boolean = item.user?.incomingFriendships[0]?.status === 'PENDING';
                const hasSentInvitation: boolean = item.user?.outgoingFriendships[0]?.status === 'PENDING';
                // console.log(`hasIcommingFriendShip: ${hasIcommingFriendShip}`);
                // console.log(`hasSentInvitation: ${hasSentInvitation}`);

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
                        onPress={() => setToggleModal(true)}
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
          )
        )}
      </View>
    </SafeAreaView>
  );
}


const modalStyles = StyleSheet.create({
  button: {
    borderRadius: 20,
    elevation: 2,
    padding: 10,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  // buttonOpen: {
  //   backgroundColor: '#F194FF',
  // },
  centeredView: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    // marginTop: -42,
    padding: 20,
    // zIndex: 1000
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalView: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
    // margin: 20,
    padding: 35,
    shadowColor: '#171717',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: '100%'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  avatarContainer: {
    flexDirection: 'row',
    gap: 14,
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
