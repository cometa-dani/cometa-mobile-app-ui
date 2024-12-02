import { AboutYourSelfForm } from '@/components/onboarding/user/steps/aboutYourSelf';
import { HeaderProgressBar } from '@/components/onboarding/user/steps/components/headerProgressBar';
import { CreateYourProfileForm } from '@/components/onboarding/user/steps/createYourProfile';
import { UploadYouPhotosForm } from '@/components/onboarding/user/steps/uploadYourPhotos';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import PagerView, { usePagerView } from 'react-native-pager-view';


const title = ['Create Your Profile', 'About Yourself', 'Upload Your Photos', 'Done'];

export default function OnboardUser() {
  const { ref, setPage, setProgress, progress } = usePagerView();
  const nextPage = progress.position + 1;
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

      <HeaderProgressBar
        activePage={nextPage}
        title={title[progress.position]}
      />

      <PagerView
        ref={ref}
        style={{ flex: 1 }}
        initialPage={0}
        scrollEnabled={false}
        onPageScroll={(e) => {
          setProgress({
            position: e.nativeEvent.position,
            offset: e.nativeEvent.offset
          });
        }}
      >
        <CreateYourProfileForm
          key={0}
          onNext={() => setPage(1)}
          activatePage={nextPage}
        />
        <UploadYouPhotosForm
          key={1}
          onNext={() => setPage(2)}
          activatePage={nextPage}
        />
        <AboutYourSelfForm
          key={2}
          onNext={() => setPage(3)}
          activatePage={nextPage}
        />
      </PagerView>
    </>
  );
}
