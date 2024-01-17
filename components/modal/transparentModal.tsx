/* eslint-disable no-unused-vars */
import { useState, type FC, type ReactNode, Dispatch, SetStateAction } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  // SlideInDown,
  // SlideOutDown,
  // FadeIn,
  // FadeOut,
} from 'react-native-reanimated';
// import { backDrop } from '../../constants/colors';


interface AppModalProps {
  children: (setIsOpen: Dispatch<SetStateAction<boolean>>) => ReactNode,
}
export const AppTransparentModal: FC<AppModalProps> = ({ children }) => {
  const offsetY = useSharedValue(0);
  const [isOpen, setIsOpen] = useState(false);

  // animation
  const transformY = useAnimatedStyle(() => ({
    transform: [{ translateY: offsetY.value }],
    // height: '50%',
  }));

  return (
    <Animated.View style={[styles.backdrop, transformY]}>
      {children(setIsOpen)}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'transparent',
  }
});
