import { TabBar } from '@/components/tabBar/tabBar';
import { Redirect, Stack, Tabs } from 'expo-router';


export default function TabLayout() {
  const isNotLoggedIn = true;
  if (isNotLoggedIn) {
    return <Redirect href="/onboarding" />;
  }
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false
        }}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tabs.Screen key="home" name="index" />
        <Tabs.Screen name="chat" />
        <Tabs.Screen name="bucketList" />
        <Tabs.Screen name="userProfile" />
      </Tabs>
    </>
  );
}
