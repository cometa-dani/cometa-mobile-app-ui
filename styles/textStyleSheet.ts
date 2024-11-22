import { createStyleSheet } from 'react-native-unistyles';


export const textStyleSheet = createStyleSheet((theme) => ({
  heading: (fontSize: number) => ({
    fontSize: fontSize,
    fontFamily: theme.text.fontBold,
    color: theme.colors.gray900,
  }),
  paragraph: (bold = false) => ({
    // fontSize: theme.text.size.md,
    fontFamily: bold ? theme.text.fontBold : theme.text.fontRegular,
    color: theme.colors.gray900,
  })
}));
