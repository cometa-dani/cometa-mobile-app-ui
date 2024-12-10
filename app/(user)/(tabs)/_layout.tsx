import { TabBar } from '@/components/tabBar/tabBar';
import { Tabs } from 'expo-router';
import { SystemBars } from 'react-native-edge-to-edge';


export default function TabLayout() {
  return (
    <>
      <SystemBars style='light' />

      <Tabs
        screenOptions={{
          headerShown: true,
          headerTransparent: true
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
