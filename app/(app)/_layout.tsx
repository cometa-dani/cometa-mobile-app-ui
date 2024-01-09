import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, router } from 'expo-router';
import { Pressable } from 'react-native';
import { useColors } from '../../components/Themed';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useCometaStore } from '../../store/cometaStore';


/**
 *
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
export function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={31} style={{ marginTop: 0 }} {...props} />;
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
      <StatusBar style={'light'} />

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
            headerTitleStyle: { display: 'none' },
            headerShown: true,
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            headerRight: () => (
              // <Link href="/bucketList" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="sliders"
                    size={30}
                    color={gray300}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
              // </Link>
            ),
          }}
        />
        <Tabs.Screen
          listeners={{ tabPress: (e) => e.preventDefault() }}
          name="discover"
          options={{
            tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
          }}
        />
        <Tabs.Screen
          listeners={{ tabPress: (e) => e.preventDefault() }}
          name="notifications"
          options={{
            tabBarIcon: ({ color }) => <TabBarIcon name="envelope" color={color} />,
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
