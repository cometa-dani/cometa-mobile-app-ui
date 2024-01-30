import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, router } from 'expo-router';
import { Pressable } from 'react-native';
import { View, useColors } from '../../components/Themed';
import { StatusBar } from 'expo-status-bar';
import { FC, ReactNode, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useCometaStore } from '../../store/cometaStore';
import { Image } from 'expo-image';
import { icons, titles } from '../../constants/assets';
import { RectButton } from 'react-native-gesture-handler';
import { gray_900 } from '../../constants/colors';
import { If } from '../../components/helpers/ifElse';


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
  const isAuthenticated = useCometaStore(state => state.isAuthenticated);
  const setIsAuthenticated = useCometaStore(state => state.setIsAuthenticated);

  // listens only for log-out event
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);


  if (!isAuthenticated) {
    return null;
  }
  return (
    <>
      <StatusBar style={'auto'} />

      <Tabs
        screenOptions={() => {
          // TODO: rewrite this to React Navigation v7
          return ({
            tabBarStyle: {
              height: 60,
              shadowColor: 'transparent',
              elevation: 0,
              borderTopWidth: 0,
              // display: 'none'
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
          name='userProfile'
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
