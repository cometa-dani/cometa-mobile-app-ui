import { TabBar } from '@/components/tabBar/tabBar';
import { Redirect, Tabs } from 'expo-router';


export default function TabLayout() {
  const isNotLoggedIn = true;
  if (isNotLoggedIn) {
    return <Redirect href="/onboarding" />;
  }
  return (
    <Tabs
      screenOptions={{
        headerTransparent: true,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="bucketList" />
      <Tabs.Screen name="userProfile" />
    </Tabs>
  );
}
