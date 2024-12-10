import { Platform } from 'react-native';
import { createStyleSheet } from 'react-native-unistyles';


export const textStyleSheet = createStyleSheet((theme, runtime) => ({
  heading: (fontSize: number) => ({
    fontSize: fontSize * runtime.fontScale,
    fontFamily: theme.text.fontBold,
    color: theme.colors.gray900,
  }),
  font: (bold = false) => {
    const size: number = Platform.select({
      ios: theme.text.size.s4,
      android: theme.text.size.s5
    })
      ?? theme.text.size.s4;
    return ({
      fontSize: size,
      fontFamily: bold ? theme.text.fontSemibold : theme.text.fontRegular,
      color: theme.colors.gray900,
    });
  }
}));
