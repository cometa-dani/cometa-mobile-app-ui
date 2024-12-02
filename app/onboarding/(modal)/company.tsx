import { TextView } from '@/components/text/text';
import { VStack } from '@/components/utils/stacks';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';


export default function OnboardUser() {
  return (
    <>
      <StatusBar style='auto' />

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
