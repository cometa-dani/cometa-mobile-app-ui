import { TabBar } from '@/components/tabBar/tabBar';
import { FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { SystemBars } from 'react-native-edge-to-edge';
import { useStyles } from 'react-native-unistyles';


export default function TabLayout() {
  const { theme } = useStyles();
  return (
    <>
      <SystemBars style='auto' />

      <Tabs
        screenOptions={{
          headerShown: true,
          headerTransparent: true,
          tabBarInactiveTintColor: theme.colors.gray300,
          tabBarActiveTintColor: theme.colors.red100,
          tabBarHideOnKeyboard: true,
          tabBarVisibilityAnimationConfig: {
            hide: {
              animation: 'timing',
              config: {
                duration: 400,
              },
            },
            show: {
              animation: 'timing',
              config: {
                duration: 400,
              },
            }
          }
        }}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tabs.Screen
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" size={26} color={color} />
            )
          }}
          key="home"
          name="index"
        />
        <Tabs.Screen
          options={{
            tabBarLabel: 'Chat',
            tabBarIcon: ({ color }) => (
              <Ionicons name="chatbubbles" size={26} color={color} />
            )
          }}
          name="chat"
        />
        <Tabs.Screen
          options={{
            tabBarLabel: 'Bucketlist',
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="heart-circle-check" size={24} color={color} />
            )
          }}
          name="bucketList"
        />
        <Tabs.Screen
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="user-circle-o" size={24} color={color} />
            )
          }}
          name="userProfile"
        />
      </Tabs>
    </>
  );
}
