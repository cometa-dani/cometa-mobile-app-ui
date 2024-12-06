import { TabBar } from '@/components/tabBar/tabBar';
import { Tabs } from 'expo-router';


export default function TabLayout() {
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
