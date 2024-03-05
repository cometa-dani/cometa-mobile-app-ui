// components
import { animationDuration, screenOptions } from '../constants/vars';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack, } from 'expo-router';
import ToastManager from 'toastify-react-native';

// hooks
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { Dimensions, useColorScheme, } from 'react-native';

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
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
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
          <RootLayoutNav />
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ThemeProvider>
  );
}


function RootLayoutNav(): JSX.Element {
  return (
    <Stack>
      <Stack.Screen name='index' options={screenOptions} />

      <Stack.Screen name="(onboarding)" options={{ ...screenOptions }} />

      <Stack.Screen name="(app)" options={screenOptions} />

      <Stack.Screen
        name="matches/[eventId]"
        options={{
          presentation: 'fullScreenModal',
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
