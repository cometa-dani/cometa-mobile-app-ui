// import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColors } from '@components/Themed';
// import { Pressable } from 'react-native';


export default function TabLayout() {
  const { text, tabIconSelected } = useColors();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { height: 0, display: 'none' },
        headerShown: false,
        tabBarInactiveTintColor: text,
        tabBarShowLabel: false,
        tabBarActiveTintColor: tabIconSelected
      }}>
      <Tabs.Screen
        redirect={true}
        name="index"
      />
      <Tabs.Screen
        name="register"
      />
      <Tabs.Screen
        name="login"
      />
    </Tabs>
  );
}
