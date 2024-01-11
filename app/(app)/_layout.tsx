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
          tabBarActiveTintColor: red100
        }}>
        <Tabs.Screen
          name="index"
          options={{
            headerTitleAlign: 'center',
            headerShown: true,
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
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
                <Image style={{ height: 24, width: 110 }} source={require('../../assets/images/letters_cometa.webp')} />
              );
            },
            headerRight: () => (
              // <Link href="/bucketList" asChild>
              <View style={{ flex: 1, gap: 4, flexDirection: 'row', alignItems: 'center' }}>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="bell"
                      size={25}
                      color={gray300}
                      style={{ marginRight: 18, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="sliders"
                      size={30}
                      color={gray300}
                      style={{ marginRight: 18, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </View>
              // </Link>
            ),
          }}
        />
        <Tabs.Screen
          listeners={{ tabPress: (e) => e.preventDefault() }}
          name="discover"
          options={{
            tabBarIcon: ({ color }) => <TabBarIcon name="comments" color={color} />,
          }}
        />
        <Tabs.Screen
          name="bucketList"
          options={{
            headerTitleAlign: 'center',
            headerShown: true,
            tabBarIcon: ({ color }) => <TabBarIcon name="list-ul" color={color} />,
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
                <Image style={{ height: 70, width: 142 }} source={require('../../assets/images/bucketList.webp')} />
              );
            },
            headerRight: () => (
              <View style={{ flex: 1, gap: 4, flexDirection: 'row', alignItems: 'center' }}>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="bell"
                      size={25}
                      color={gray300}
                      style={{ marginRight: 18, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="sliders"
                      size={30}
                      color={gray300}
                      style={{ marginRight: 18, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </View>
            )
          }}
        />
        <Tabs.Screen
          name='userProfile'
          options={{
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
