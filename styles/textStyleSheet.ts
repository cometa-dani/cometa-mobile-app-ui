import { createStyleSheet } from 'react-native-unistyles';


export const textStyleSheet = createStyleSheet((theme, runtime) => ({
  heading: (fontSize: number) => ({
    fontSize: fontSize,
    fontFamily: theme.text.fontBold,
    color: theme.colors.gray900,
  }),
  font: (bold = false) => ({
    // fontSize: Platform.select({ ios: theme.text.size.s4, android: theme.text.size.s5 }),
    fontFamily: bold ? theme.text.fontBold : theme.text.fontRegular,
    color: theme.colors.gray900,
  })
}));
