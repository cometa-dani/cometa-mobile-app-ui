import { createStyleSheet } from 'react-native-unistyles';


export const buttonsStyleSheet = createStyleSheet((theme) => ({
  buttonRedText: (pressed: boolean) => ({
    textAlign: 'center',
    color: theme.colors.white100,
    fontFamily: theme.text.fontSemibold,
    animationTimingFunction: 'ease-in-out',
  }),
  buttonRed: (pressed: boolean) => ({
    width: '100%',
    backgroundColor: pressed ? theme.colors.red90 : theme.colors.red100,
    padding: theme.spacing.sp4,
    borderRadius: theme.radius.sm,
    borderWidth: 2,
    borderColor: pressed ? theme.colors.red100 : theme.colors.red90,
    shadowColor: theme.colors.red100,
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
  }),
  buttonRedAlt: (pressed: boolean) => ({
    width: '100%',
    backgroundColor: pressed ? theme.colors.white90 : theme.colors.white100,
    padding: theme.spacing.sp4,
    borderRadius: theme.radius.sm,
    borderWidth: 2,
    borderColor: pressed ? theme.colors.red90 : theme.colors.red100,
    shadowColor: theme.colors.red100,
    shadowOpacity: pressed ? 0 : 0.2,
    shadowOffset: pressed ? { width: 0, height: 3 } : undefined,
    shadowRadius: 2,
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
  }),
  buttonRedAltText: (pressed: boolean) => ({
    textAlign: 'center',
    color: theme.colors.red100,
    fontFamily: theme.text.fontSemibold,
    animationTimingFunction: 'ease-in-out',
  }),

  buttonBlueAlt: (pressed: boolean) => ({
    width: '100%',
    backgroundColor: pressed ? theme.colors.white90 : theme.colors.white100,
    padding: theme.spacing.sp4,
    borderRadius: theme.radius.sm,
    borderWidth: 2,
    borderColor: pressed ? theme.colors.blue90 : theme.colors.blue100,
    shadowColor: theme.colors.blue100,
    shadowOpacity: pressed ? 0 : 0.2,
    shadowOffset: pressed ? { width: 0, height: 3 } : undefined,
    shadowRadius: 2,
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
  }),
  buttonBlueAltText: (pressed: boolean) => ({
    textAlign: 'center',
    color: theme.colors.blue100,
    fontFamily: theme.text.fontSemibold,
    animationTimingFunction: 'ease-in-out',
  }),
}));
