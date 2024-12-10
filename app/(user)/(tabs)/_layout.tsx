import { TabBar } from '@/components/tabBar/tabBar';
import { GradientHeading } from '@/components/text/gradientText';
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
          headerTitleAlign: 'center',
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
            headerTitle: () => (
              <GradientHeading styles={[{ fontSize: theme.text.size.s8 }]}>
                cometa
              </GradientHeading>
            ),
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
            headerTitle: () => (
              <GradientHeading styles={[{ fontSize: theme.text.size.s8 }]}>
                chat
              </GradientHeading>
            ),
            tabBarIcon: ({ color }) => (
              <Ionicons name="chatbubbles" size={26} color={color} />
            )
          }}
          name="chat"
        />
        <Tabs.Screen
          options={{
            tabBarLabel: 'Bucketlist',
            headerTitle: () => (
              <GradientHeading styles={[{ fontSize: theme.text.size.s8 }]}>
                bucketlist
              </GradientHeading>
            ),
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="heart-circle-check" size={24} color={color} />
            )
          }}
          name="bucketList"
        />
        <Tabs.Screen
          options={{
            tabBarLabel: 'Profile',
            headerTitle: () => (
              <GradientHeading styles={[{ fontSize: theme.text.size.s8 }]}>
                profile
              </GradientHeading>
            ),
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
