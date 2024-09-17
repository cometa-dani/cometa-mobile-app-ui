/* eslint-disable react-native/no-unused-styles */
import { Tabs, router } from 'expo-router';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { View, useColors, Text } from '../../components/Themed';
import { StatusBar } from 'expo-status-bar';
import { FC, ReactNode, useEffect, useMemo } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase/firebase';
import { useCometaStore } from '../../store/cometaStore';
import { Image } from 'expo-image';
import { icons, titles } from '../../constants/assets';
import { RectButton } from 'react-native-gesture-handler';
import { red_100, white_50 } from '../../constants/colors';
import { If } from '../../components/utils/ifElse';
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

const TabButton: FC<{ children: ReactNode }> = ({ children }) => {
  const localStyle = Platform.OS === 'android' ? stylesAndroid : stylesIOS;
  return (
    <RectButton style={localStyle.tabButton}>
      {children}
    </RectButton>
  );
};

export default function AppLayout() {
  const dynamicStyles = Platform.OS === 'android' ? stylesAndroid : stylesIOS;
  const { gray300, red100 } = useColors();
  const isCurrentUserAuthenticated = useCometaStore(state => state.isAuthenticated);
  const loggedInUserUUID = useCometaStore(state => state.uid);
  const setIsCurrentUserAuthenticated = useCometaStore(state => state.setIsAuthenticated);
  const friendsLatestMessagesList = useCometaStore(state => state.friendsLatestMessagesList) ?? [];
  const notificationIsSeen = useCometaStore(state => state.notificationsList).at(-1)?.user?.isSeen;

  const totalNewMessages = useMemo(() => (
    friendsLatestMessagesList.map(({ newMessagesCount }) => newMessagesCount ?? 0).reduce((prev, curr) => prev + curr, 0)
  ), [friendsLatestMessagesList]);

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

      <Tabs
        // safeAreaInsets={{ bottom: 0 }}
        screenOptions={() => {
          // TODO: rewrite this to React Navigation v7
          return ({
            tabBarStyle: {
              height: dynamicStyles.tabBar.height,
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
                <MaterialCommunityIcons
                  style={{ marginBottom: -2.2 }}
                  name="home-circle-outline"
                  size={35}
                  color={color}
                />
                <Text size='xs' color={color}>Home</Text>
              </TabButton>
            ),
            headerTitle() {
              return (
                <Image style={{ height: 24, width: 110 }} source={titles.cometa} />
              );
            },
            headerRight: () => (
              <View style={dynamicStyles.headerRightContainer}>
                <Pressable
                  style={{ position: 'relative' }}
                  onPress={() => router.push(`/notifications/${loggedInUserUUID}`)}
                >
                  {({ pressed }) => (
                    <>
                      <If
                        condition={notificationIsSeen === false}
                        render={(
                          <View style={dynamicStyles.notificationIndicator} />
                        )}
                      />
                      <Ionicons
                        style={{ opacity: pressed ? 0.5 : 1 }}
                        name="notifications"
                        size={30}
                        color={gray300}
                      />
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
                    <View style={dynamicStyles.newMessagesIndicator}>
                      <Text style={dynamicStyles.newMessagesText}>{totalNewMessages}</Text>
                    </View>
                  )}
                />
                <Ionicons style={{ transform: [{ rotateY: '180deg' }] }} name="chatbubble" size={29} color={color} />
                <Text size='xs' color={color}>Chat</Text>
              </TabButton>
            ),
          }}
        />
        <Tabs.Screen
          name="bucketList/index"
          options={{
            headerTitleAlign: 'center',
            headerShown: true,
            tabBarIcon: ({ color }) => (
              <TabButton>
                <FontAwesome6 name="heart-circle-check" size={29} color={color} />
                <Text size='xs' color={color}>Bucket list</Text>
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
          name='loggedInUserProfile/index'
          options={{
            tabBarIcon: ({ color }) => (
              <TabButton>
                <FontAwesome name="user-circle-o" size={29} color={color} />
                <Text size='xs' color={color}>Profile</Text>
              </TabButton>
            ),
          }}
        />
      </Tabs>
    </>
  );
}


const stylesAndroid = StyleSheet.create({
  tabBar: {
    height: 70
  },

  tabButton: {
    top: 2,
    height: '100%',
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    gap: -1,
    position: 'relative',
    flex: 1
  },

  headerRightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
    gap: 8
  },

  notificationIndicator: {
    borderRadius: 50,
    width: 8,
    height: 8,
    backgroundColor: red_100,
    position: 'absolute',
    top: -2
  },

  newMessagesIndicator: {
    position: 'absolute',
    top: 4,
    right: -14,
    backgroundColor: red_100,
    width: 17,
    height: 17,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  newMessagesText: {
    color: white_50,
    fontWeight: 'bold',
    fontSize: 12
  }
});

// Styles object
const stylesIOS = StyleSheet.create({

  tabBar: {
    height: 90
  },

  tabButton: {
    top: -2,
    height: '100%',
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    gap: -1,
    position: 'relative',
    flex: 1
  },

  headerRightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
    gap: 8
  },

  notificationIndicator: {
    borderRadius: 50,
    width: 8,
    height: 8,
    backgroundColor: red_100,
    position: 'absolute',
    top: -2
  },

  newMessagesIndicator: {
    position: 'absolute',
    top: 4,
    right: -14,
    backgroundColor: red_100,
    width: 17,
    height: 17,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  newMessagesText: {
    color: white_50,
    fontWeight: 'bold',
    fontSize: 12
  }
});
