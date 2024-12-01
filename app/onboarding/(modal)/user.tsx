import { AboutYourSelfForm } from '@/components/onboarding/bottomSheet/steps/aboutYourSelf';
import { CreateYourProfileForm } from '@/components/onboarding/bottomSheet/steps/createYourProfile';
import { UploadYouPhotosForm } from '@/components/onboarding/bottomSheet/steps/uploadYourPhotos';
import { ProgressBar } from '@/components/progressBar/progressBar';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useReducer } from 'react';
import { View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useStyles } from 'react-native-unistyles';


export default function OnboardUser() {
  const router = useRouter();
  const { theme } = useStyles();
  const [nextStep, setNextStep] = useReducer(prev => (++prev % 3), 0);
  const handleLastStep = () => router.push('/(tabs)/index');
  return (
    <>
      <StatusBar style='auto' />

      <Stack.Screen
        options={{
          gestureDirection: 'vertical',
          fullScreenGestureEnabled: true,
          gestureEnabled: true,
          headerShadowVisible: false,
          headerTitle: '',
          headerShown: true,
          headerBackTitle: 'Back',
          animation: 'slide_from_bottom',
        }}
      />

      <View style={{
        paddingTop: 0,
        paddingHorizontal: theme.spacing.sp10,
      }}>
        <ProgressBar value={(nextStep + 1) * 33.3333} />
      </View>

      <PagerView style={{ flex: 1 }} initialPage={0}>
        <CreateYourProfileForm
          key={0}
          onNextStep={setNextStep}
        />
        <UploadYouPhotosForm
          key={1}
          onNextStep={setNextStep}
        />
        <AboutYourSelfForm
          key={2}
          onNextStep={handleLastStep}
        />
      </PagerView>
    </>
  );
}
