import { textStyleSheet } from '@/styles/textStyleSheet';
import { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { useStyles } from 'react-native-unistyles';


interface TextProps {
  children: React.ReactNode;
  bold?: boolean;
  style?: StyleProp<TextStyle>
}

export const TextView: FC<TextProps> = ({ children, bold = false, style }) => {
  const { styles } = useStyles(textStyleSheet);
  return (
    <Text
      allowFontScaling={true}
      style={[styles.font(bold), style]}
    >
      {children}
    </Text>
  );
};
