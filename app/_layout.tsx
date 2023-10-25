import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { auth } from '../firebase/firebase';


// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from 'expo-router';


export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(app)/',
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

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
      }
      else {
        router.push('/(onboarding)/register');
      }
    });
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />

        {/* TODO: set a condition that when user is not authenticated shows onboarding */}
        <Stack.Screen
          name="(onboarding)"
          options={{
            headerShown: false,
            animation: 'slide_from_left',
          }} />
        {/* otherwise shows the (app) */}

        <Stack.Screen name="bucketList" options={{ presentation: 'modal', headerTitle: 'BucketList' }} />
      </Stack>
    </ThemeProvider>
  );
}
