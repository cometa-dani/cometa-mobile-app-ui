import { SystemBars } from 'react-native-edge-to-edge';
import { Stack } from 'expo-router';


export default function LoginScreen() {
  return (
    <>
      <SystemBars style='auto' />

      <Stack.Screen
        options={{
          gestureDirection: 'vertical',
          fullScreenGestureEnabled: true,
          gestureEnabled: true,
          headerShadowVisible: false,
          headerTitle: '',
          headerShown: true,
          animation: 'slide_from_bottom',
        }}
      />

    </>
  );
}
