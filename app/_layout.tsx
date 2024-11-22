import 'expo-dev-client';
// components
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SplashScreen, Stack, useRouter, } from 'expo-router';
import ToastManager from 'toastify-react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
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
  const router = useRouter();
  const [loaded, error] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      // TOOD:
      // read from local storage to check if user is logged in
      // if not, redirect to login screen
      router.replace('/onboarding');
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={new QueryClient()}>
      <ToastManager
        duration={2800 * 2}
        animationOutTiming={800}
        animationInTiming={800}
      />
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <RootLayoutNav />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}


function RootLayoutNav(): ReactNode {
  return (
    <Stack
      screenOptions={{
        // headerTitleStyle: { fontFamily: 'Poppins' },
        headerShown: false,
        animation: 'slide_from_right',
      }}>

      {/* <Stack.Screen
        name="onboarding"
        options={{ headerShown: true, animation: 'slide_from_right', animationDuration: 290 }}
      /> */}

      {/* <Stack.Screen
        name='index'
        options={{ animation: 'slide_from_right', animationDuration: 290 }}
      /> */}

      {/*

      <Stack.Screen
        name="(app)"
        options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 290 }}
      /> */}
    </Stack>
  );
}
