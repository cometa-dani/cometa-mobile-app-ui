import { textStyleSheet } from '@/styles/textStyleSheet';
import { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { useStyles } from 'react-native-unistyles';


interface TextProps {
  children: React.ReactNode;
  bold?: boolean;
  style?: StyleProp<TextStyle>,
  ellipsis?: boolean
}

export const TextView: FC<TextProps> = ({ children, bold = false, style, ellipsis }) => {
  const { styles } = useStyles(textStyleSheet);
  return (
    <Text
      allowFontScaling={true}
      ellipsizeMode='tail'
      numberOfLines={ellipsis ? 1 : undefined}
      style={[styles.font(bold), style]}
    >
      {children}
    </Text>
  );
};
