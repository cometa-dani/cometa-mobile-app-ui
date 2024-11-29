import { createStyleSheet } from 'react-native-unistyles';
import { forwardRef, ReactNode } from 'react';
import { GestureResponderEvent, Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { TextView } from '../text/text';


interface IButtonProps {
  children: ReactNode,
  variant: 'primary' | 'primary-alt' | 'secondary' | 'secondary-alt',
  size?: 'sm' | 'md' | 'lg',
  onPress: (event: GestureResponderEvent) => void,
  isInsideBottomSheet?: boolean,
  style?: StyleProp<ViewStyle>
}

export const Button = forwardRef<View, IButtonProps>(({
  children,
  onPress,
  variant,
  isInsideBottomSheet = false,
  style = {}
},
  ref
) => {
  const { styles: buttonsStyles } = useStyles(buttonsStyleSheet, {
    color: variant
  });

  if (isInsideBottomSheet) {
    return (
      <TouchableOpacity
        style={[buttonsStyles.buttonContainer(), style]}
        onPress={onPress}
      >
        <TextView style={buttonsStyles.buttonText()}>{children}</TextView>
      </TouchableOpacity>
    );
  }
  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      style={({ pressed }) => [buttonsStyles.buttonContainer(pressed), style]}
    >
      {() => (
        <TextView style={buttonsStyles.buttonText()}>
          {children}
        </TextView>
      )}
    </Pressable>
  );
});

Button.displayName = 'Button';


export const buttonsStyleSheet = createStyleSheet((theme) => ({
  buttonText: () => ({
    textAlign: 'center',
    fontFamily: theme.text.fontSemibold,
    animationTimingFunction: 'ease-in-out',
    variants: {
      color: {
        'primary': {
          color: theme.colors.white100,
        },
        'primary-alt': {
          color: theme.colors.red100,
        },
        'secondary': {
          color: theme.colors.white100,
        },
        'secondary-alt': {
          color: theme.colors.blue100,
        }
      }
    }
  }),
  buttonContainer: (pressed = false) => ({
    width: '100%',
    padding: theme.spacing.sp4,
    borderRadius: theme.radius.sm,
    borderWidth: 1.6,
    shadowOpacity: pressed ? 0 : 0.2,
    shadowOffset: pressed ? { width: 0, height: 2 } : undefined,
    shadowRadius: 2,
    elevation: pressed ? 0 : 1.5,
    animationTimingFunction: 'ease-in-out',
    transform: [
      {
        translateY: pressed ? 1 : 0,
      },
      {
        scale: pressed ? 0.99 : 1
      }
    ],
    variants: {
      color: {
        'primary': {
          backgroundColor: pressed ? theme.colors.red90 : theme.colors.red100,
          borderColor: pressed ? theme.colors.red100 : theme.colors.red90,
          shadowColor: theme.colors.red100,
        },
        'primary-alt': {
          backgroundColor: pressed ? theme.colors.white90 : theme.colors.white100,
          borderColor: pressed ? theme.colors.red90 : theme.colors.red100,
          shadowColor: theme.colors.red100,
        },
        'secondary': {
          backgroundColor: pressed ? theme.colors.blue90 : theme.colors.blue100,
          borderColor: pressed ? theme.colors.blue100 : theme.colors.blue90,
          shadowColor: theme.colors.blue100,
        },
        'secondary-alt': {
          backgroundColor: pressed ? theme.colors.white90 : theme.colors.white100,
          borderColor: pressed ? theme.colors.blue90 : theme.colors.blue100,
          shadowColor: theme.colors.blue100,
        },
      },
    }
  })
}));
