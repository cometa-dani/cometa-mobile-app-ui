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
    red50: '#F2B8C8',

    blue100: '#5ac8fa',
    blue90: '#51C3E3',
    blue80: '#75d9ff',
    blue70: '#85dbff',

    gray50: '#f0f0f0',
    gray100: '#e5e5e5',
    gray200: '#afafaa',
    gray300: '#7C8591',
    gray400: '#5e5e5e',
    gray500: '#4f4f4f',
    gray900: '#030303',

    white100: '#fff',

    white70: '#F2F2F2', // (a light grayish-white color)
    white80: '#F7F7F7', // (a very light grayish-white color)
    white90: '#FAFAFA', // (a very light grayish-white color)

    backDrop: 'rgba(0, 0, 0, 0.6)',
  },
  radius: {
    xs: 10,
    sm: 16,
    md: 20,
    lg: 30,
    xl: 40,
    xxl: 50
  },
  spacing: {
    sp1: 4,
    sp2: 8,
    sp4: 12,
    sp6: 16,
    sp7: 18,
    sp8: 20,
    sp10: 24,
    sp11: 28,
    sp12: 32,
    sp14: 40,
    sp16: 48,
    sp18: 56,
    sp20: 64,
    sp22: 72,
    sp24: 80,
    sp32: 96
  },
  icons: {
    xs: 14,
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
      s1: 10,
      s2: 12,
      s4: 15,
      s5: 16,
      s6: 18,
      s7: 20,
      s8: 24,
      s9: 28,
      s10: 30,
      s12: 36,
      s14: 40
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
