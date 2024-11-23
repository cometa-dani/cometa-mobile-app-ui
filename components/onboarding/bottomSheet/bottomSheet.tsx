import { forwardRef, useReducer } from 'react';
import DefaultBottomSheet, { BottomSheetView, } from '@gorhom/bottom-sheet';
import { ProgressBar } from '@/components/progressBar/progressBar';
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { CreateYourProfileForm } from './steps/createYourProfile';
import { AboutYourSelfForm } from './steps/aboutYourSelf';
import { UploadYouPhotosForm } from './steps/uploadYourPhotos';


const snapPoints = ['50%', '78%', '100%'];


interface IProps {
  name?: string,
}
export const BottomSheet = forwardRef<BottomSheetMethods, IProps>((props, ref) => {
  const { theme } = useStyles();
  const [nextStep, setNextStep] = useReducer(prev => (++prev % 3), 0);
  return (
    <DefaultBottomSheet
      $modal={false}
      ref={ref}
      index={2}
      enableDynamicSizing={false}
      enablePanDownToClose={true}
      keyboardBehavior="extend"
      snapPoints={snapPoints}
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
          >
            <AboutYourSelfForm
              onNextStep={setNextStep}
            />
          </Animated.View>
        )}
      </SafeAreaView>
    </DefaultBottomSheet>
  );
});

BottomSheet.displayName = 'BottomSheetModal';

// useEffect(() => {
//   const keyboardDidShowListener = Keyboard.addListener(
//     'keyboardDidShow',
//     () => {
//       bottomSheetRef.current?.expand();
//     }
//   );
//   return () => {
//     keyboardDidShowListener.remove();
//   };
// }, []);
