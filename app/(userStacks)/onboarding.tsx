import { SystemBars } from 'react-native-edge-to-edge';
import { AboutYourSelfForm } from '@/components/onboarding/user/steps/aboutYourSelf';
import { HeaderProgressBar } from '@/components/onboarding/user/steps/components/headerProgressBar';
import { CreateYourProfileForm } from '@/components/onboarding/user/steps/createYourProfile';
import { UploadYouPhotosForm } from '@/components/onboarding/user/steps/uploadYourPhotos';
import PagerView, { usePagerView } from 'react-native-pager-view';
import { Stack } from 'expo-router';
import { useStyles } from 'react-native-unistyles';


const title = ['Create Your Profile', 'Upload Your Photos', 'About Yourself'];

export default function OnboardUserScreen() {
  const { theme } = useStyles();
  const { ref, setPage, setProgress, progress } = usePagerView();
  const nextPage = progress.position + 1;
  return (
    <>
      <SystemBars style='auto' />

      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: '',
          headerShown: true,
          animation: 'slide_from_bottom',
          contentStyle: {
            backgroundColor: theme.colors.white100
          }
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
        />
        <UploadYouPhotosForm
          key={1}
          onNext={() => setPage(2)}
        />
        <AboutYourSelfForm
          key={2}
          onNext={() => setPage(3)}
        />
      </PagerView>
    </>
  );
}
