import { createStyleSheet } from 'react-native-unistyles';
import { forwardRef, ReactNode } from 'react';
import { GestureResponderEvent, Pressable, Text, View } from 'react-native';
import { useStyles } from 'react-native-unistyles';


interface IButtonProps {
  children: ReactNode,
  variant: 'primary' | 'primary-alt' | 'secondary' | 'secondary-alt',
  size?: 'sm' | 'md' | 'lg',
  onPressed: (event: GestureResponderEvent) => void
}

export const Button = forwardRef<View, IButtonProps>(({ children, onPressed, variant }, ref) => {
  const { styles: buttonsStyles } = useStyles(buttonsStyleSheet, {
    color: variant
  });
  return (
    <Pressable
      ref={ref}
      onPress={onPressed}
      style={({ pressed }) => buttonsStyles.buttonContainer(pressed)}
    >
      {({ pressed }) => (
        <Text style={buttonsStyles.buttonText(pressed)}>
          {children}
        </Text>
      )}
    </Pressable>
  );
});

Button.displayName = 'Button';


export const buttonsStyleSheet = createStyleSheet((theme) => ({
  buttonText: (pressed: boolean) => ({
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
  buttonContainer: (pressed: boolean) => ({
    width: '100%',
    padding: theme.spacing.sp4,
    borderRadius: theme.radius.sm,
    borderWidth: 2,
    shadowOpacity: pressed ? 0 : 0.4,
    shadowOffset: pressed ? { width: 0, height: 3 } : undefined,
    shadowRadius: 3,
    elevation: pressed ? 0 : 2.5,
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
