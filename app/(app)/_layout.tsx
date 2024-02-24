/* eslint-disable react-native/no-raw-text */
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, router } from 'expo-router';
import { Pressable, Text as TransparentText } from 'react-native';
import { View, useColors, Text } from '../../components/Themed';
import { StatusBar } from 'expo-status-bar';
import { FC, ReactNode, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useCometaStore } from '../../store/cometaStore';
import { Image } from 'expo-image';
import { icons, titles } from '../../constants/assets';
import { RectButton } from 'react-native-gesture-handler';
import { gray_900, white_50 } from '../../constants/colors';
import { If } from '../../components/utils/ifElse';
import { useInfiniteQueryGetLikedEventsForBucketListByLoggedInUser } from '../../queries/loggedInUser/eventHooks';
import ReactNativeModal from 'react-native-modal';
import { appButtonstyles } from '../../components/buttons/buttons';


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
  <RectButton style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </RectButton>
);

export default function AppLayout() {
  const { gray300 } = useColors();
  const isCurrentUserAuthenticated = useCometaStore(state => state.isAuthenticated);
  const setIsCurrentUserAuthenticated = useCometaStore(state => state.setIsAuthenticated);

  // bucket list empty modal
  const [toggleModal, setToggleModal] = useState(false);
  const { data } = useInfiniteQueryGetLikedEventsForBucketListByLoggedInUser();


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
        <View style={{ minHeight: 200, width: 300, alignItems: 'center', justifyContent: 'center', padding: 20, borderRadius: 20, alignSelf: 'center' }}>
          <View style={{ gap: 20 }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', }}>Bucket List is Empty</Text>
              <Text style={{ textAlign: 'center' }}>No events liked yet</Text>
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
        screenOptions={() => {
          // TODO: rewrite this to React Navigation v7
          return ({
            tabBarStyle: {
              height: 60,
              shadowColor: 'transparent',
              elevation: 0,
              borderTopWidth: 0,
            },
            headerStyle: { elevation: 0, shadowColor: 'transparent' },
            headerShown: false,
            tabBarInactiveTintColor: gray300,
            tabBarShowLabel: false,
            tabBarActiveTintColor: gray_900,
            tabBarActiveBackgroundColor: '#eee',
          });
        }}>
        <Tabs.Screen
          name="index"
          options={{
            headerTitleAlign: 'center',
            headerShown: true,
            tabBarIcon: ({ focused }) => (
              <TabButton>
                <If condition={focused}
                  render={(
                    <Image style={{ width: 34, height: 34 }} source={icons.homeRed} />
                  )}
                  elseRender={(
                    <Image style={{ width: 34, height: 34 }} source={icons.home} />
                  )}
                />
              </TabButton>
            ),
            headerLeft: () => (
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="search"
                    size={28}
                    color={gray300}
                    style={{ marginLeft: 18, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
            headerTitle() {
              return (
                <Image style={{ height: 24, width: 110 }} source={titles.cometa} />
              );
            },
            headerRight: () => (
              // <Link href="/bucketList" asChild>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 18, gap: 8 }}>
                <Pressable>
                  {({ pressed }) => (
                    <Image style={{ height: 34, width: 34, opacity: pressed ? 0.5 : 1 }} source={icons.notifications} />
                  )}
                </Pressable>
                <Pressable>
                  {({ pressed }) => (
                    <Image style={{ height: 34, width: 34, opacity: pressed ? 0.5 : 1 }} source={icons.filter} />
                  )}
                </Pressable>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="discover"
          listeners={{ tabPress: (e) => e.preventDefault() }}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabButton>
                <If condition={focused}
                  render={(
                    <Image style={{ width: 30, height: 30 }} source={icons.commentRed} />
                  )}
                  elseRender={(
                    <Image style={{ width: 30, height: 30 }} source={icons.comment} />
                  )}
                />
              </TabButton>
            ),
          }}
        />
        <Tabs.Screen
          name="bucketList"
          listeners={{
            focus: (args) => {
              if (!data?.pages[0]?.totalEvents) {
                setTimeout(() => setToggleModal(true), 600);
              }
            }
          }}
          options={{
            headerTitleAlign: 'center',
            headerShown: true,
            tabBarIcon: ({ focused }) => (
              <TabButton>
                <If condition={focused}
                  render={(
                    <Image style={{ width: 38, height: 38 }} source={icons.bucketListRed} />
                  )}
                  elseRender={(
                    <Image style={{ width: 38, height: 38 }} source={icons.bucketList} />
                  )}
                />
              </TabButton>
            ),
            headerTitle() {
              return (
                <Image style={{ height: 70, width: 142 }} source={titles.bucketList} />
              );
            },
            headerRight: () => (
              <Pressable style={{ marginRight: 18 }}>
                {({ pressed }) => (
                  <Image style={{ height: 34, width: 34, opacity: pressed ? 0.5 : 1 }} source={icons.filter} />
                )}
              </Pressable>
            )
          }}
        />
        <Tabs.Screen
          name='loggedInUserProfile'
          options={{
            tabBarIcon: ({ focused }) => (
              <TabButton>
                <If condition={focused}
                  render={(
                    <Image style={{ width: 34, height: 34 }} source={icons.profileRed} />
                  )}
                  elseRender={(
                    <Image style={{ width: 34, height: 34 }} source={icons.profile} />
                  )}
                />
              </TabButton>
            ),
          }}
        />
      </Tabs>
    </>
  );
}
