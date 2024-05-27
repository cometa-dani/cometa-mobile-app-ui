/* eslint-disable react-native/no-raw-text */
import { Tabs, router } from 'expo-router';
import { Pressable, StyleSheet, Text as TransparentText } from 'react-native';
import { View, useColors, Text } from '../../components/Themed';
import { StatusBar } from 'expo-status-bar';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase/firebase';
import { useCometaStore } from '../../store/cometaStore';
import { Image } from 'expo-image';
import { icons, titles } from '../../constants/assets';
import { RectButton } from 'react-native-gesture-handler';
import { gray_900, red_100, white_50 } from '../../constants/colors';
import { If } from '../../components/utils/ifElse';
import { useInfiniteQueryGetLikedEventsForBucketListByLoggedInUser } from '../../queries/loggedInUser/eventHooks';
import ReactNativeModal from 'react-native-modal';
import { appButtonstyles } from '../../components/buttons/buttons';
// icons
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';


/**
 *
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
export function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return (
    <FontAwesome {...props} size={31} />
  );
}

const TabButton: FC<{ children: ReactNode }> = ({ children }) => (
  <RectButton style={styles.tabButton}>
    {children}
  </RectButton>
);

export default function AppLayout() {
  const { gray300, red100 } = useColors();
  const isCurrentUserAuthenticated = useCometaStore(state => state.isAuthenticated);
  const loggedInUserUUID = useCometaStore(state => state.uid);
  const setIsCurrentUserAuthenticated = useCometaStore(state => state.setIsAuthenticated);
  const friendsLatestMessagesList = useCometaStore(state => state.friendsLatestMessagesList) ?? [];
  const notificationsList = useCometaStore(state => state.notificationsList) ?? [];

  // bucket list empty modal
  const [toggleModal, setToggleModal] = useState(false);
  const { data, isSuccess } = useInfiniteQueryGetLikedEventsForBucketListByLoggedInUser();


  const totalNewMessages = useMemo(() => (
    friendsLatestMessagesList.map(({ newMessagesCount }) => newMessagesCount ?? 0).reduce((prev, curr) => prev + curr, 0)
  ), [friendsLatestMessagesList]);


  const totalNotifications = useMemo(() => (
    notificationsList.length
  ), [notificationsList.length]);


  // listens only for log-out event
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
        setIsCurrentUserAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);


  if (!isCurrentUserAuthenticated) {
    return null;
  }
  return (
    <>
      <StatusBar style={'auto'} />

      <ReactNativeModal isVisible={toggleModal}>
        <View style={styles.modalContainer}>
          <View style={{ gap: 20 }}>
            <View>
              <Text style={styles.modalTitle}>Bucket List is Empty</Text>
              <Text style={styles.modalText}>No events liked yet</Text>
            </View>

            <Pressable
              style={{ ...appButtonstyles.button, backgroundColor: gray_900 }}
              onPress={() => {
                setToggleModal(false);
                setTimeout(() => router.push('/(app)/'), 600);
              }} >
              <TransparentText style={{ ...appButtonstyles.buttonText, color: white_50 }}>
                Close
              </TransparentText>
            </Pressable>
          </View>
        </View>
      </ReactNativeModal>

      <Tabs
        // safeAreaInsets={{ bottom: 0 }}
        screenOptions={() => {
          // TODO: rewrite this to React Navigation v7
          return ({
            tabBarStyle: {
              // height: 70,
              shadowColor: 'transparent',
              elevation: 0,
              borderTopWidth: 0,
            },
            headerStyle: { elevation: 0, shadowColor: 'transparent' },
            headerShown: false,
            tabBarInactiveTintColor: gray300,
            tabBarShowLabel: false,
            tabBarActiveTintColor: red100,
            tabBarActiveBackgroundColor: '#eee',
            headerTitleStyle: { fontFamily: 'Poppins' },
          });
        }}>
        <Tabs.Screen
          name="index"
          options={{
            headerTitleAlign: 'center',
            headerShown: true,
            tabBarIcon: ({ color }) => (
              <TabButton>
                <MaterialCommunityIcons name="home-circle-outline" size={45} color={color} />
              </TabButton>
            ),
            headerTitle() {
              return (
                <Image style={{ height: 24, width: 110 }} source={titles.cometa} />
              );
            },
            headerRight: () => (
              <View style={styles.headerRightContainer}>
                <Pressable style={{ position: 'relative' }} onPress={() => router.push(`/notifications/${loggedInUserUUID}`)}>
                  {({ pressed }) => (
                    <>
                      <If
                        condition={totalNotifications}
                        render={(
                          <View style={styles.notificationIndicator} />
                        )}
                      />
                      <Ionicons style={{ opacity: pressed ? 0.5 : 1 }} name="notifications" size={30} color={gray300} />
                    </>
                  )}
                </Pressable>
                <Pressable onPress={() => router.push('/filter')}>
                  {({ pressed }) => (
                    <Image style={{ height: 34, width: 34, opacity: pressed ? 0.5 : 1 }} source={icons.filter} />
                  )}
                </Pressable>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="chatApp"
          options={{
            tabBarIcon: ({ color }) => (
              <TabButton>
                <If
                  condition={totalNewMessages}
                  render={(
                    <View style={styles.newMessagesIndicator}>
                      <Text style={styles.newMessagesText}>{totalNewMessages}</Text>
                    </View>
                  )}
                />
                <Ionicons style={{ transform: [{ rotateY: '180deg' }] }} name="chatbubble" size={34} color={color} />
              </TabButton>
            ),
          }}
        />
        <Tabs.Screen
          name="bucketList"
          listeners={{
            focus: () => {
              if (!data?.pages[0]?.totalEvents && isSuccess) {
                setTimeout(() => setToggleModal(true), 600);
              }
            }
          }}
          options={{
            headerTitleAlign: 'center',
            headerShown: true,
            tabBarIcon: ({ color }) => (
              <TabButton>
                <FontAwesome6 name="heart-circle-check" size={34} color={color} />
              </TabButton>
            ),
            headerTitle() {
              return (
                <Image style={{ height: 70, width: 142 }} source={titles.bucketList} />
              );
            }
          }}
        />
        <Tabs.Screen
          name='loggedInUserProfile'
          options={{
            tabBarIcon: ({ color }) => (
              <TabButton>
                <FontAwesome name="user-circle-o" size={34} color={color} />
              </TabButton>
            ),
          }}
        />
      </Tabs>
    </>
  );
}


// Styles object
const styles = StyleSheet.create({

  notificationIndicator: {
    borderRadius: 50,
    width: 8,
    height: 8,
    backgroundColor: red_100,
    position: 'absolute',
    top: -2
  },

  tabButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  modalContainer: {
    minHeight: 200,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 20,
    alignSelf: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    textAlign: 'center'
  },
  headerRightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
    gap: 8
  },
  newMessagesIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: red_100,
    width: 20,
    height: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  newMessagesText: {
    color: white_50,
    fontWeight: '900',
    fontSize: 14
  }
});
