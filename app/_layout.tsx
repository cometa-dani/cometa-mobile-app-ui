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
import { EventActionSheet } from '../components/actionSheet/actionSheet';
import { useCometaStore } from '../store/cometaStore';
import { Image } from 'expo-image';


// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/index',
};

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
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

const animationDuration = 290;

function RootLayoutNav(): JSX.Element {
  const likedEvent = useCometaStore(state => state.likedEvent);
  const toggleActionSheet = useCometaStore(state => state.toggleActionSheet);
  const setToggleActionSheet = useCometaStore(state => state.setToggleActionSheet);
  const screenOptions = { headerShown: false, animation: 'slide_from_right', animationDuration } as ScreenProps;

  return (
    <>
      <Stack>
        <Stack.Screen name='index' options={screenOptions} />

        <Stack.Screen name="(onboarding)" options={{ ...screenOptions }} />

        <Stack.Screen name="(app)" options={screenOptions} />

        <Stack.Screen
          name="[connectWithPeople]"
          options={{
            presentation: 'modal',
            headerTitleAlign: 'center',
            headerShadowVisible: true,
            headerTitle: () => <Image style={{ height: 24, width: 110 }} source={require('../assets/images/letters_cometa.webp')} />,
            animationDuration,
          }}
        />
      </Stack>

      <EventActionSheet
        eventItem={likedEvent}
        isOpen={toggleActionSheet}
        setIsOpen={setToggleActionSheet}
      />
    </>
  );
}
