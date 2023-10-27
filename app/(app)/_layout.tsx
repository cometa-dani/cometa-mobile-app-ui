import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, router } from 'expo-router';
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
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={38} style={{ marginTop: 0 }} {...props} />;
}


export default function AppLayout() {
  const { text, tabIconSelected } = useColors();
  const isAuthenticated = useCometaStore(state => state.isAuthenticated);
  const setIsAuthenticated = useCometaStore(state => state.setIsAuthenticated);

  useEffect(() => {
    // listens for log-out event
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
          tabBarStyle: { height: 58 },
          headerShown: false,
          tabBarInactiveTintColor: text,
          tabBarShowLabel: false,
          tabBarActiveTintColor: tabIconSelected
        }}>
        <Tabs.Screen
          name="index"
          options={{
            // headerShown: false,
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            headerRight: () => (
              <Link href="/bucketList" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="info-circle"
                      size={25}
                      color={text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="discover"
          options={{
            tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            tabBarIcon: ({ color }) => <TabBarIcon name="envelope" color={color} />,
          }}
        />
        <Tabs.Screen
          name="userProfile"
          options={{
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
