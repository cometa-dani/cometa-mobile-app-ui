import { TabBar } from '@/components/tabBar/tabBar';
import { GradientHeading } from '@/components/text/gradientText';
import { Condition } from '@/components/utils/ifElse';
import { icons } from '@/constants/assets';
import { useQueryGetUserProfile } from '@/queries/currentUser/userHooks';
import { useCometaStore } from '@/store/cometaStore';
import { FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Image, Pressable, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { useStyles } from 'react-native-unistyles';


export default function TabLayout() {
  const { theme } = useStyles();
  const router = useRouter();
  const notificationIsSeen = useCometaStore(state => state.notificationsList).at(0)?.user?.isSeen;
  const { data: userProfile } = useQueryGetUserProfile();

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
            headerLeft: () => (
              <Pressable onPress={() => router.push('/(stacks)/search')}>
                {({ pressed }) => (
                  <Ionicons
                    name="search"
                    size={32}
                    color={theme.colors.gray300}
                    style={{
                      marginLeft: 18,
                      opacity: pressed ? 0.5 : 1
                    }}
                  />
                )}
              </Pressable>
            ),
            headerTitle: () => (
              <GradientHeading styles={[{ fontSize: theme.text.size.s8 }]}>
                cometa
              </GradientHeading>
            ),
            headerRight: () => (
              <View >
                <Pressable
                  style={{ position: 'relative' }}
                  onPress={() => router.push(`/(stacks)/notifications/${userProfile?.id}`)}
                >
                  {({ pressed }) => (
                    <>
                      <Condition
                        if={notificationIsSeen === false}
                        then={(
                          <View />
                        )}
                      />
                      <Ionicons
                        style={{ opacity: pressed ? 0.5 : 1 }}
                        name="notifications"
                        size={30}
                        color={theme.colors.gray300}
                      />
                    </>
                  )}
                </Pressable>
                <Pressable onPress={() => router.push('/(stacks)/filter')}>
                  {({ pressed }) => (
                    <Image
                      style={{ height: 34, width: 34, opacity: pressed ? 0.5 : 1 }}
                      source={icons.filter}
                    />
                  )}
                </Pressable>
              </View>
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
