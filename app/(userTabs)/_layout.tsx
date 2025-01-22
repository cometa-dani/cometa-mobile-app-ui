import { CircleButton } from '@/components/button/circleButton';
import { Indicator } from '@/components/indicator/indicator';
import { TabBar } from '@/components/tabBar/tabBar';
import { GradientHeading } from '@/components/text/gradientText';
import { Condition } from '@/components/utils/ifElse';
import { HStack } from '@/components/utils/stacks';
import { usePrefetchBucketList } from '@/queries/currentUser/eventHooks';
import { usePrefetchUserProfile } from '@/queries/currentUser/userHooks';
import { useCometaStore } from '@/store/cometaStore';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, Tabs, useRouter } from 'expo-router';
import { ReactNode } from 'react';
import { View } from 'react-native';
import { useStyles } from 'react-native-unistyles';


export default function TabLayout(): ReactNode {
  usePrefetchBucketList();
  const { theme } = useStyles();
  const router = useRouter();
  // const notificationIsSeen = useCometaStore(state => state.notificationsList).at(0)?.user?.isSeen;
  const session = useCometaStore(state => state.session);
  const newMessages = useCometaStore(state => state.newMessages);
  usePrefetchUserProfile(); // don't remove

  if (!session?.user) {
    return <Redirect href="/welcome" />;
  }
  return (
    <>
      <Tabs
        screenOptions={{
          animation: 'shift',
          headerTitleAlign: 'center',
          headerShown: true,
          sceneStyle: { backgroundColor: theme.colors.white80 },
          headerStyle: {
            elevation: 1,
          },
          tabBarInactiveTintColor: theme.colors.gray400,
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
            headerTransparent: true,
            headerShadowVisible: false,
            headerStyle: {
              elevation: 0,
            },
            headerLeft: () => (
              <CircleButton onPress={() => router.push('/(userStacks)/search')}>
                <Ionicons
                  name="search"
                  size={theme.spacing.sp8}
                  color={theme.colors.white100}
                />
              </CircleButton>
            ),
            headerTitle: () => (
              <GradientHeading styles={[{ fontSize: theme.text.size.s9 }]}>
                cometa
              </GradientHeading>
            ),
            headerRight: () => (
              <HStack
                styles={{ marginRight: theme.spacing.sp4 }}
              >
                <CircleButton
                  onPress={() => router.push('/(userStacks)/notifications')}
                >
                  <>
                    <Condition
                      if={false}
                      then={(
                        <Indicator />
                      )}
                    />
                    <Ionicons
                      name="notifications"
                      size={theme.spacing.sp8}
                      color={theme.colors.white100}
                    />
                  </>
                </CircleButton>
                <CircleButton
                  onPress={() => router.push('/(userStacks)/filter')}
                >
                  <Ionicons
                    name="options"
                    size={theme.spacing.sp8}
                    color={theme.colors.white100}
                  />
                </CircleButton>
              </HStack>
            ),
            tabBarIcon: ({ color }) => (
              <Ionicons name="home-outline" size={24} color={color} />
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
              <View style={{ position: 'relative' }}>
                <Condition
                  if={newMessages}
                  then={<Indicator />}
                />
                <Ionicons name="chatbubbles-outline" size={26} color={color} />
              </View>
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
              <MaterialCommunityIcons name="heart-plus-outline" size={24} color={color} />
            )
          }}
          name="bucketList"
        />
        <Tabs.Screen
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="user-o" size={24} color={color} />
            )
          }}
          name="userProfile"
        />
      </Tabs>
    </>
  );
}
