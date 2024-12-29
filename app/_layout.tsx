import 'expo-dev-client';
import '../styles/unistyles';
// components
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SplashScreen, Stack } from 'expo-router';
import { NotifierWrapper } from 'react-native-notifier';
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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Subscription } from '@supabase/supabase-js';


// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from 'expo-router';
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/(userTabs)/index',
  // initialRouteName: '/index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
      retryDelay: 1_000 * 6,
    },
    mutations: {
      retry: 1,
      retryDelay: 1_000 * 6,
    }
  }
});

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});


/**
 *
 * TODO: improve race conditions promises vs subscriptions
 */
export default function RootLayout() {
  const [isFontLoaded, error] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
    PoppinsSemibold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
    ...FontAwesome.font,
  });
  const setSession = useCometaStore(state => state.setSession);
  const isSessionLoaded = useCometaStore(state => state.isLoaded);
  const setSessionIsLoaded = useCometaStore(state => state.setIsLoaded);

  useEffect(() => {
    let subscription: Subscription;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        setSessionIsLoaded(true);
      }
      const { data: { subscription: subs } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!isSessionLoaded) {
          setSessionIsLoaded(true);
        }
        setSession(session);
      });
      subscription = subs;
    })();
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (isFontLoaded && isSessionLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isFontLoaded, isSessionLoaded]);

  if (!isSessionLoaded) {
    return null;
  }
  return <Root />; // too  many re-renders
}


function Root(): ReactNode {
  const { theme } = useStyles();
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <NotifierWrapper duration={5_000}>
                <Stack
                  initialRouteName='(userTabs)'
                  screenOptions={{
                    headerShown: false,
                    headerTitle: '',
                    headerStyle: { backgroundColor: theme.colors.white100 },
                    contentStyle: { backgroundColor: theme.colors.white80 },
                    headerTitleStyle: { fontFamily: theme.text.fontSemibold },
                    headerBackTitleStyle: { fontFamily: theme.text.fontMedium },
                    headerBackTitle: 'Back',
                  }}
                >
                  <Stack.Screen name='welcome'
                    options={{
                      animation: 'fade',
                      headerShown: true,
                      headerTransparent: true,
                      headerBackVisible: false,
                      headerStyle: { backgroundColor: 'transparent' },
                    }}
                  />
                  <Stack.Screen name='(userTabs)' options={{ animation: 'fade' }} />
                  <Stack.Screen name='(companyTabs)' options={{ animation: 'fade' }} />
                </Stack>
              </NotifierWrapper>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </KeyboardProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
