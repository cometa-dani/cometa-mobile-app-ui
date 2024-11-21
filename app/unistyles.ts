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
    typography: '#000000',
    background: '#ffffff'
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12
  }
} as const;

export const darkTheme = {
  colors: {
    typography: '#ffffff',
    background: '#000000'
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12
  }
} as const;

// define other themes

type AppBreakpoints = typeof breakpoints
type AppThemes = {
  light: typeof lightTheme,
  dark: typeof darkTheme
}

declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends AppBreakpoints { }
  export interface UnistylesThemes extends AppThemes { }
}

UnistylesRegistry
  .addBreakpoints(breakpoints)
  .addThemes({
    light: lightTheme,
    dark: darkTheme,
  })
  .addConfig({
    adaptiveThemes: true
  });
