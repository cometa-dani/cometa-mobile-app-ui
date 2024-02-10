import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';


export default function OnboardingLayout() {
  return (
    <>
      <StatusBar style={'auto'} />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="whatIsYourName" />
        <Stack.Screen name="whatIsYourEmail" />
        <Stack.Screen name="whenIsYourBirthday" />
        <Stack.Screen name="addPhotos" />
      </Stack>
    </>
  );
}
