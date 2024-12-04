import { SystemBars } from 'react-native-edge-to-edge';
import { TextView } from '@/components/text/text';
import { VStack } from '@/components/utils/stacks';
import { Stack } from 'expo-router';


export default function OnboardUser() {
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
          headerBackTitle: 'Back',
          animation: 'slide_from_bottom',
        }}
      />
      <VStack>
        <TextView>Onboard Company</TextView>
      </VStack>
    </>
  );
}
