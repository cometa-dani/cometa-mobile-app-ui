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
  utils: {
    // you can even use functions here
    lighter: (color: string, percentage: number) => {

      const hslRegex = /^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/;
      const match = color.match(hslRegex);
      if (!match) {
        throw new Error(`Invalid HSL color: ${color}`);
      }
      const hue = parseInt(match[1]);
      const saturation = parseInt(match[2]);
      const lightness = parseInt(match[3]);
      const newLightness = Math.min(100, lightness + (percentage / 100) * (100 - lightness));
      return `hsl(${hue}, ${saturation}%, ${newLightness}%)`;
    },
    darker: (color: string, percentage: number) => {
      const hslRegex = /^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/;
      const match = color.match(hslRegex);
      if (!match) {
        throw new Error(`Invalid HSL color: ${color}`);
      }
      const hue = parseInt(match[1]);
      const saturation = parseInt(match[2]);
      const lightness = parseInt(match[3]);
      const newLightness = Math.max(0, lightness - (percentage / 100) * lightness);
      return `hsl(${hue}, ${saturation}%, ${newLightness}%)`;
    }
  },
  colors: {
    red100: '#E43F62',
    red90: '#EA4C6C',
    red80: '#EA5F7C',
    red70: '#EA708C',

    blue100: '#5ac8fa',
    blue90: '#51C3E3',
    blue80: '#75d9ff',
    blue70: '#85dbff',

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

    backDrop: 'rgba(0, 0, 0, 0.7)',
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
  icons: {
    sm: 16,
    md: 22,
    lg: 26
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
