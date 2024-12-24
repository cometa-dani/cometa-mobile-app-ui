import { createStyleSheet } from 'react-native-unistyles';
import { forwardRef, ReactNode } from 'react';
import { ActivityIndicator, GestureResponderEvent, Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { TextView } from '../text/text';
import { Condition } from '../utils/ifElse';


interface IButtonProps {
  children: ReactNode,
  variant: 'primary' | 'primary-alt' | 'secondary' | 'secondary-alt' | 'disabled',
  size?: 'sm' | 'md' | 'lg',
  onPress: (event: GestureResponderEvent) => void,
  isInsideBottomSheet?: boolean,
  style?: StyleProp<ViewStyle>,
  showLoading?: boolean
}

export const Button = forwardRef<View, IButtonProps>(({
  children,
  onPress,
  variant,
  isInsideBottomSheet = false,
  style = {},
  showLoading = false
},
  ref
) => {
  const { styles: buttonsStyles } = useStyles(buttonsStyleSheet, {
    color: variant
  });

  const handleOnPress = (event: GestureResponderEvent): void => {
    if (showLoading) return; // if loading or submitting disable onPress
    onPress(event);
  };

  if (isInsideBottomSheet) {
    return (
      <TouchableOpacity
        disabled={showLoading}
        style={[buttonsStyles.buttonContainer(), style]}
        onPress={handleOnPress}
      >
        <TextView style={buttonsStyles.buttonText()}>{children}</TextView>
        <Condition
          if={showLoading}
          then={
            <ActivityIndicator
              size="small"
              color="white"
            />
          }
        />
      </TouchableOpacity>
    );
  }
  return (
    <Pressable
      ref={ref}
      disabled={showLoading}
      onPress={handleOnPress}
      style={({ pressed }) => [buttonsStyles.buttonContainer(pressed), style]}
    >
      {() => (
        <>
          <TextView style={buttonsStyles.buttonText()}>
            {children}
          </TextView>
          <Condition
            if={showLoading}
            then={
              <ActivityIndicator
                size="small"
                color="white"
              />
            }
          />
        </>
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
    flex: 1,
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
        },
        'disabled': {
          color: theme.colors.gray900,
        }
      }
    }
  }),
  buttonContainer: (pressed = false) => ({
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sp1,
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
        'disabled': {
          backgroundColor: pressed ? theme.colors.gray50 : theme.colors.gray100,
          borderColor: pressed ? theme.colors.gray100 : theme.colors.gray200,
          shadowColor: theme.colors.gray100,
        }
      },
    }
  })
}));
