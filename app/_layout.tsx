// components
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack, } from 'expo-router';
import { ScreenProps } from 'react-native-screens';

// hooks
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { useColorScheme, } from 'react-native';

// query client for server state
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

  return <RootLayoutNav />;
}


function RootLayoutNav(): JSX.Element {
  const colorScheme = useColorScheme();
  const screenOptions = { headerShown: false, animation: 'slide_from_right' } as ScreenProps;
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={new QueryClient()}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name='index' options={screenOptions} />

            <Stack.Screen name="(onboarding)" options={screenOptions} />

            <Stack.Screen name="(app)" options={screenOptions} />

            <Stack.Screen name="bucketList" options={{ presentation: 'modal', headerTitle: 'BucketList' }} />

            <Stack.Screen name="[connectWithPeople]" options={{ presentation: 'modal', headerTitle: 'Connect with People' }} />
          </Stack>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
