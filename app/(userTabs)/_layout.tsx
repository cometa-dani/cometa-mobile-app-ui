import { CircleButton } from '@/components/button/circleButton';
import { TabBar } from '@/components/tabBar/tabBar';
import { GradientHeading } from '@/components/text/gradientText';
import { Condition } from '@/components/utils/ifElse';
import { HStack } from '@/components/utils/stacks';
import { usePrefetchBucketList } from '@/queries/currentUser/eventHooks';
import { useQueryGetUserProfile } from '@/queries/currentUser/userHooks';
import { useCometaStore } from '@/store/cometaStore';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { ReactNode } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


export default function TabLayout(): ReactNode {
  usePrefetchBucketList();
  const { theme } = useStyles(stylesheet);
  const router = useRouter();
  const notificationIsSeen = useCometaStore(state => state.notificationsList).at(0)?.user?.isSeen;
  const { data: userProfile } = useQueryGetUserProfile();

  return (
    <Tabs
      screenOptions={{
        animation: 'shift',
        headerTitleAlign: 'center',
        headerShown: true,
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
                onPress={() => router.push(`/(userStacks)/notifications?userId=${userProfile?.id}`)}
              >
                <>
                  <Condition
                    if={notificationIsSeen === false}
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
            <Ionicons name="chatbubbles-outline" size={26} color={color} />
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
  );
}


const Indicator = () => {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.notificationIndicator} />
  );
};

const stylesheet = createStyleSheet((theme) => ({
  notificationIndicator: {
    borderRadius: 50,
    width: 8,
    height: 8,
    backgroundColor: theme.colors.red100,
    position: 'absolute',
    top: -2
  }
}));

