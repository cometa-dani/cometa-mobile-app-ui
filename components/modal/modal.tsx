import type { FC, ReactNode } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  SlideInDown,
  SlideOutDown,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


const AnimatedPressable = Animated.createAnimatedComponent(Pressable);


interface IModalProps {
  children: ReactNode,
  isOpen: boolean,
  setIsOpen: (openOrClose: boolean) => void
}
export const Modal: FC<IModalProps> = ({ children, isOpen, setIsOpen }) => {
  const { styles } = useStyles(styleSheet);
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


const styleSheet = createStyleSheet((theme) => ({
  backdrop: {
    alignItems: 'center',
    backgroundColor: theme.colors.backDrop,
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 1000,
  }
}));
