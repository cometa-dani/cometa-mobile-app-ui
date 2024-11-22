/* eslint-disable no-unused-vars */
import type { FC, ReactNode } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  SlideInDown,
  SlideOutDown,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { backDrop } from '../../constants/colors';


const AnimatedPressable = Animated.createAnimatedComponent(Pressable);


interface AppModalProps {
  children: ReactNode,
  isOpen: boolean,
  setIsOpen: (openOrClose: boolean) => void
}
export const AppModal: FC<AppModalProps> = ({ children, isOpen, setIsOpen }) => {
  const offsetY = useSharedValue(0);

  const closeModal = (): void => {
    setIsOpen(false);
    setTimeout(() => {
      offsetY.value = 0;
    }, 100);
  };

  // animation
  const transformY = useAnimatedStyle(() => ({
    transform: [{ translateY: offsetY.value }],
  }));

  return (
    isOpen && (
      <AnimatedPressable
        style={styles.backdrop}
        entering={FadeIn}
        exiting={FadeOut}
        onPressOut={closeModal}
      >
        <Animated.View
          style={transformY}
          entering={
            SlideInDown
              .springify()
              .restSpeedThreshold(2).stiffness(90).mass(0.5)
          }
          exiting={SlideOutDown.springify()}
        >
          {children}
        </Animated.View>
      </AnimatedPressable>
    )
  );
};


const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: backDrop,
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 1000,
  }
});
