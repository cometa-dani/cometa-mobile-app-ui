import 'expo-dev-client';
import '../styles/unistyles';
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
import { useStyles } from 'react-native-unistyles';
import { supabase } from '@/supabase/config';
import { useCometaStore } from '@/store/cometaStore';
import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from 'expo-router';
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/(user)/(tabs)/index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});


configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});


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
  const { theme } = useStyles();
  const setSession = useCometaStore(state => state.setSession);
  const setIsLoading = useCometaStore(state => state.setIsLoading);

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (!session) return;
        setSession(session);
      })
      .catch()
      .finally(() => setIsLoading(false));

    supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoading(false);
      if (!session) return;
      setSession(session);
    });
  }, []);

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
            <Stack
              screenOptions={{
                animation: 'fade',
                headerTitle: '',
                headerStyle: { backgroundColor: theme.colors.white100 },
                contentStyle: { backgroundColor: theme.colors.white100 },
                headerTitleStyle: { fontFamily: theme.text.fontSemibold },
                headerBackTitleStyle: { fontFamily: theme.text.fontMedium },
                headerBackTitle: 'Back',
              }}
            >
              <Stack.Screen
                name='index'
                options={{
                  headerTransparent: true,
                  headerStyle: { backgroundColor: 'transparent' },
                  headerTitle: '',
                }}
              />
              <Stack.Screen
                name='(user)/onboarding'
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='(user)/login'
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='(user)/(tabs)'
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='(company)/onboarding'
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='(company)/(tabs)'
                options={{ headerShown: false }}
              />
            </Stack>
          </BottomSheetModalProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
