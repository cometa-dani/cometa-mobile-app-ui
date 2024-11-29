import { TextView } from '@/components/text/text';
import { VStack } from '@/components/utils/stacks';
import { Stack } from 'expo-router';


export default function OnboardUser() {
  return (
    <>
      <Stack.Screen
        options={{
          gestureDirection: 'vertical',
          fullScreenGestureEnabled: true,
          gestureEnabled: true,
          headerShown: true,
          animation: 'fade_from_bottom',
          presentation: 'modal',
        }}
      />
      <VStack>
        <TextView>Onboard user</TextView>
      </VStack>
    </>
  );
}
