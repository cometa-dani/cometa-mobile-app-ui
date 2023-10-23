import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { useColors } from '@components/Themed';
import { StatusBar } from 'expo-status-bar';


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


export default function TabLayout() {
  const { text, tabIconSelected } = useColors();

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
              <Link href="/modal" asChild>
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
