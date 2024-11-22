import { UnistylesRegistry } from 'react-native-unistyles';


export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  superLarge: 2000,
  tvLike: 4000
} as const;


export const lightTheme = {
  colors: {
    red100: '#EA385C',
    red90: '#E93F65',
    red80: '#E1335B',
    red70: '#E0325C',

    blue100: '#5ac8fa',
    gray50: '#f0f0f0',
    gray100: '#e5e5e5',
    gray200: '#afafaa',
    gray300: '#7C8591',
    gray500: '#4f4f4f',
    gray900: '#030303',

    white100: '#fff',

    white70: '#F2F2F2', // (a light grayish-white color)
    white80: '#F7F7F7', // (a very light grayish-white color)
    white90: '#FAFAFA', // (a very light grayish-white color)

    backDrop: 'rgba(0, 0, 0, 0.4)',
  },
  radius: {
    xs: 10,
    sm: 15,
    md: 20,
    lg: 30,
    xl: 40,
    xxl: 50
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32
  },
  text: {
    fontRegular: 'Poppins',
    fontMedium: 'PoppinsMedium',
    fontSemibold: 'PoppinsSemibold',
    fontBold: 'PoppinsBold',
    size: {
      xs: 10,
      sm: 12,
      md: 15,
      lg: 18,
      xl: 24,
      xxl: 30,
      xxxl: 36,
    }
  }
} as const;

// define other themes

type AppBreakpoints = typeof breakpoints
type AppThemes = {
  light: typeof lightTheme,
  // dark: typeof darkTheme
}

declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends AppBreakpoints { }
  export interface UnistylesThemes extends AppThemes { }
}

UnistylesRegistry
  .addBreakpoints(breakpoints)
  .addThemes({
    light: lightTheme,
    // dark: darkTheme,
  })
  .addConfig({
    initialTheme: 'light',
    adaptiveThemes: true
  });
