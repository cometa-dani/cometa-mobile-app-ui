// components
import { animationDuration } from '../constants/vars';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack, } from 'expo-router';
import ToastManager from 'toastify-react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';


// hooks
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { useColorScheme, } from 'react-native';

// query client for server state
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { titles } from '../constants/assets';


// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from 'expo-router';

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: '/index',
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
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

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={new QueryClient()}>
        <ToastManager
          duration={2800 * 2}
          animationOutTiming={800}
          animationInTiming={800}
        />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <RootLayoutNav />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ThemeProvider>
  );
}


function RootLayoutNav(): JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitleStyle: { fontFamily: 'Poppins' }
      }}>
      <Stack.Screen name='index' options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 290 }} />

      <Stack.Screen name="(onboarding)" options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 290 }} />

      <Stack.Screen name="(app)" options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 290 }} />

      <Stack.Screen
        name="matches/[eventId]"
        options={{
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerTitle: () => (
            <Image
              style={{ height: 24, width: 110 }}
              source={titles.matches}
            />
          ),
          animationDuration: animationDuration,
        }}
      />
    </Stack>
  );
}
