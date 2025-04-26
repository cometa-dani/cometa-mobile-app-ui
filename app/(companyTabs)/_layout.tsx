import { TabBar } from '@/components/tabBar/tabBar';
import { GradientHeading } from '@/components/text/gradientText';
import { useCometaStore } from '@/store/cometaStore';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Redirect, router, Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useStyles } from 'react-native-unistyles';


export default function CompanyTabLayout() {
  const { theme } = useStyles();
  const session = useCometaStore(state => state.session);

  if (session?.user?.user_metadata.role !== 'company') {
    return <Redirect href="/(userTabs)/" />;
  }
  if (!session?.user) {
    return <Redirect href="/welcome" />;
  }
  return (
    <Tabs
      screenOptions={{
        animation: 'shift',
        headerShown: true
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        options={{
          tabBarLabel: 'Dashboard',
          headerTitle: () => (
            <GradientHeading styles={[{ fontSize: theme.text.size.s7 }]}>
              Dashboard
            </GradientHeading>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={24} color={color} />
          )
        }}
        name="index"
      />
      <Tabs.Screen
        options={{
          tabBarLabel: 'Posts',
          headerTitle: () => (
            <GradientHeading styles={[{ fontSize: theme.text.size.s7 }]}>
              Posts
            </GradientHeading>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={24} color={color} />
          ),
          headerRight() {
            return (
              <TouchableOpacity
                onPress={() => router.push('/(companyStacks)/locations')}
                style={{ marginRight: theme.spacing.sp6 }}
              >
                <Feather
                  size={theme.spacing.sp10}
                  name='plus-circle'
                  color={theme.colors.gray400}
                />
              </TouchableOpacity >
            );
          },
        }}
        name="posts"
      />
      <Tabs.Screen
        options={{
          tabBarLabel: 'Profile',
          // headerTitle: () => (
          //   <GradientHeading styles={[{ fontSize: theme.text.size.s7 }]}>
          //     Company Profile
          //   </GradientHeading>
          // ),
          tabBarIcon: ({ color }) => (
            <FontAwesome name="building-o" size={24} color={color} />
          )
        }}
        name="profile"
      />
    </Tabs>
  );
}
