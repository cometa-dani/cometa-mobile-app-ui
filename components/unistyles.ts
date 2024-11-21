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
    blue100: '#5ac8fa',
    gray50: '#f0f0f0',
    gray100: '#e5e5e5',
    gray200: '#afafaa',
    gray300: '#7C8591',
    gray500: '#4f4f4f',
    gray900: '#030303',
    white50: '#fff',
    backDrop: 'rgba(0, 0, 0, 0.4)',
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12
  },
  text: {
    fontFamily: 'Poppins',
    fontSize: {
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
    adaptiveThemes: true
  });
