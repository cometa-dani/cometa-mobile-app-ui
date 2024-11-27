import { forwardRef, useReducer } from 'react';
import DefaultBottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ProgressBar } from '@/components/progressBar/progressBar';
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { Platform, SafeAreaView } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { CreateYourProfileForm } from './steps/createYourProfile';
import { AboutYourSelfForm } from './steps/aboutYourSelf';
import { UploadYouPhotosForm } from './steps/uploadYourPhotos';
import { useRouter } from 'expo-router';


const snapPoints = ['50%', '78%', '100%'];


interface IProps {
  name?: string,
}
export const BottomSheet = forwardRef<DefaultBottomSheet, IProps>((_, ref) => {
  // const bottomSheetRef = (ref as RefObject<BottomSheetMethods>);
  const router = useRouter();
  const { theme } = useStyles();
  const [nextStep, setNextStep] = useReducer(prev => (++prev % 3), 0);
  const handleLastStep = () => router.push('/(tabs)/index');

  return (
    <DefaultBottomSheet
      // needed for e2e testing
      // animationConfigs={{
      //   reduceMotion: ReduceMotion.System
      // }}
      accessible={Platform.select({
        // setting it to false on Android seems
        // to cause issues with TalkBack instead
        ios: false
      })}
      ref={ref}
      index={-1}
      enableDynamicSizing={false}
      enablePanDownToClose={true}
      keyboardBehavior="extend"
      snapPoints={snapPoints}
      // footerComponent={renderFooter}
      containerStyle={{
        flex: 1
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <BottomSheetView style={{
          paddingTop: theme.spacing.sp2,
          paddingHorizontal: theme.spacing.sp10,
        }}>
          <ProgressBar value={(nextStep + 1) * 33.3333} />
        </BottomSheetView>

        {nextStep === 0 && (
          <Animated.View
            entering={SlideInRight}
            exiting={SlideOutLeft}
            style={{ flex: 1 }}
          >
            <CreateYourProfileForm
              onNextStep={setNextStep}
            />
          </Animated.View>
        )}
        {nextStep === 1 && (
          <Animated.View
            entering={SlideInRight}
            exiting={SlideOutLeft}
            style={{ flex: 1 }}
          >
            <UploadYouPhotosForm
              onNextStep={setNextStep}
            />
          </Animated.View>
        )}
        {nextStep === 2 && (
          <Animated.View
            entering={SlideInRight}
            exiting={SlideOutLeft}
            style={{ flex: 1 }}
          >
            <AboutYourSelfForm
              onNextStep={handleLastStep}
            />
          </Animated.View>
        )}
      </SafeAreaView>
    </DefaultBottomSheet>
  );
});

BottomSheet.displayName = 'BottomSheetModal';
