import 'expo-dev-client';
// components
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SplashScreen, Stack } from 'expo-router';
import ToastManager from 'toastify-react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { KeyboardProvider } from 'react-native-keyboard-controller';

// hooks
import { useFonts } from 'expo-font';
import { ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from 'expo-router';
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
    PoppinsSemibold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return <Root />;
}


function Root(): ReactNode {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <ToastManager
        duration={2800 * 2}
        animationOutTiming={800}
        animationInTiming={800}
      />
      <GestureHandlerRootView>
        <KeyboardProvider>
          <BottomSheetModalProvider>
            <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
              <Stack.Screen name='onboarding/index' />
              <Stack.Screen name='(tabs)' />
            </Stack>
          </BottomSheetModalProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
