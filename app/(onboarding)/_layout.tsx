import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';


export default function Layout() {
  return (
    <>
      <StatusBar style={'auto'} />

      <Stack
        initialRouteName='start'
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="start" />
        <Stack.Screen name="register" />
        <Stack.Screen name="login" />
        <Stack.Screen name="uploadImage" />
      </Stack>
    </>
  );
}
