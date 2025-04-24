import { TabBar } from '@/components/tabBar/tabBar';
import { GradientHeading } from '@/components/text/gradientText';
import { useCometaStore } from '@/store/cometaStore';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { useStyles } from 'react-native-unistyles';


export default function CompanyTabLayout() {
  const { theme } = useStyles();
  const session = useCometaStore(state => state.session);

  if (!session?.user) {
    return <Redirect href="/welcome" />;
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        options={{
          tabBarLabel: 'Dashboard',
          headerTitle: () => (
            <GradientHeading styles={[{ fontSize: theme.text.size.s9 }]}>
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
            <GradientHeading styles={[{ fontSize: theme.text.size.s8 }]}>
              Events
            </GradientHeading>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={24} color={color} />
          )
        }}
        name="posts"
      />
      <Tabs.Screen
        options={{
          tabBarLabel: 'Profile',
          headerTitle: () => (
            <GradientHeading styles={[{ fontSize: theme.text.size.s8 }]}>
              Company Profile
            </GradientHeading>
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome name="building-o" size={24} color={color} />
          )
        }}
        name="profile"
      />
    </Tabs>
  );
}
