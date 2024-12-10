import { TabBar } from '@/components/tabBar/tabBar';
import { GradientHeading } from '@/components/text/gradientText';
import { Condition } from '@/components/utils/ifElse';
import { HStack } from '@/components/utils/stacks';
import { useQueryGetUserProfile } from '@/queries/currentUser/userHooks';
import { useCometaStore } from '@/store/cometaStore';
import { FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


export default function TabLayout() {
  const { theme, styles } = useStyles(stylesheet);
  const router = useRouter();
  const notificationIsSeen = useCometaStore(state => state.notificationsList).at(0)?.user?.isSeen;
  const { data: userProfile } = useQueryGetUserProfile();

  return (
    <>
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
              <TouchableOpacity
                style={styles.cirleButton}
                onPress={() => router.push('/(stacks)/search')}
              >
                <Ionicons
                  name="search"
                  size={theme.spacing.sp8}
                  color={theme.colors.white100}
                />
              </TouchableOpacity>
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
                <TouchableOpacity
                  style={styles.cirleButton}
                  onPress={() => router.push(`/(stacks)/notifications/${userProfile?.id}`)}
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
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cirleButton}
                  onPress={() => router.push('/(stacks)/filter')}
                >
                  <Ionicons
                    name="options"
                    size={theme.spacing.sp8}
                    color={theme.colors.white100}
                  />
                </TouchableOpacity>
              </HStack>
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
  },
  cirleButton: {
    marginLeft: theme.spacing.sp4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 34,
    height: 34,
    borderRadius: 99_999,
    zIndex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  }
}));
