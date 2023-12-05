/**
 * 
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */
import { Text as DefaultText, useColorScheme, View as DefaultView } from 'react-native';
import Colors from '../constants/colors';


// Define a type for theme-specific color props
type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

// Create type aliases for Text and View props with theme options
export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];


/**
 * 
 * It's intended to be used in ThemedComponents
 * Overides the selected color in Colors acording to their Theme
 * Get the appropriate color based on the current theme (light or dark) and color name.
 *
 * @param {Object} props - An object containing color values for light and dark themes.
 * @param {string} props.light - Color value for the light theme.
 * @param {string} props.dark - Color value for the dark theme.
 * @param {string} colorName - The name of the color to retrieve.
 *
 * @returns {string} The color value based on the current theme and color name.
 */
function useThemedColor(
  props: { light?: string; dark?: string }, // if present overides the Colors[theme][color]
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  // Get the current theme (light, dark, or null)
  const theme = useColorScheme() ?? 'light';

  // Check if the color is defined in the props for the current theme
  const colorFromProps = props[theme];

  if (colorFromProps) {
    // Return the color from props if defined
    return colorFromProps;
  } else {
    // Return the color from the Colors constant based on the current theme
    return Colors[theme][colorName];
  }
}


/**
 * 
 * @param colorScheme 
 * @returns {Object} the colors given the theme.
 */
export const useColors = (colorScheme?: 'light' | 'dark') => {
  const theme = useColorScheme() ?? 'light';

  if (colorScheme) {
    return Colors[colorScheme];
  }

  return Colors[theme];
};


/**
 * 
 * Custom Text component that applies the appropriate color based on the theme.
 * @param {TextProps} props - The props for the Text component, including theme options.
 * @returns {JSX.Element} - A Text component with the theme-specific color applied.
 */
export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemedColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color, fontSize: 16 }, style]} {...otherProps} />;
}

/**
 * 
 * Custom View component that applies the appropriate background color based on the theme.
 * @param {ViewProps} props - The props for the View component, including theme options.
 * @returns {JSX.Element} - A View component with the theme-specific background color applied.
 */
export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemedColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
