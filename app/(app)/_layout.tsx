import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, router } from 'expo-router';
import { Pressable } from 'react-native';
import { View, useColors } from '../../components/Themed';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useCometaStore } from '../../store/cometaStore';
import { Image } from 'expo-image';
import { icons, titles } from '../../constants/assets';


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


export default function AppLayout() {
  const { red100, gray300 } = useColors();
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
        screenOptions={{
          tabBarStyle: { height: 60, shadowColor: 'transparent', elevation: 0, borderTopWidth: 0 },
          headerStyle: { elevation: 0, shadowColor: 'transparent' },
          headerShown: false,
          tabBarInactiveTintColor: gray300,
          tabBarShowLabel: false,
          tabBarActiveTintColor: red100,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            headerTitleAlign: 'center',
            headerShown: true,
            tabBarIcon: ({ focused }) => (
              focused ?
                <Image style={{ width: 34, height: 34 }} source={icons.homeRed} />
                :
                <Image style={{ width: 34, height: 34 }} source={icons.home} />
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
          listeners={{ tabPress: (e) => e.preventDefault() }}
          name="discover"
          options={{
            tabBarIcon: ({ focused }) => (
              focused ?
                <Image style={{ width: 30, height: 30 }} source={icons.commentRed} />
                :
                <Image style={{ width: 30, height: 30 }} source={icons.comment} />
            ),
          }}
        />
        <Tabs.Screen
          name="bucketList"
          options={{
            headerTitleAlign: 'center',
            headerShown: true,
            tabBarIcon: ({ focused }) => (
              focused ?
                <Image style={{ width: 38, height: 38 }} source={icons.bucketListRed} />
                :
                <Image style={{ width: 38, height: 38 }} source={icons.bucketList} />
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
              focused ?
                <Image style={{ width: 34, height: 34 }} source={icons.profileRed} />
                :
                <Image style={{ width: 34, height: 34 }} source={icons.profile} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
