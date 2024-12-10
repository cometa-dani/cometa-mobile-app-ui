import { textStyleSheet } from '@/styles/textStyleSheet';
import { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { useStyles } from 'react-native-unistyles';


interface TextProps {
  children: React.ReactNode;
  bold?: boolean;
  style?: StyleProp<TextStyle>,
  ellipsis?: boolean,
  numberOfLines?: number
}

export const TextView: FC<TextProps> = ({ children, bold = false, style, ellipsis, numberOfLines = 1 }) => {
  const { styles } = useStyles(textStyleSheet);
  return (
    <Text
      allowFontScaling={true}
      ellipsizeMode='tail'
      numberOfLines={ellipsis ? numberOfLines : undefined}
      style={[styles.font(bold), style]}
    >
      {children}
    </Text>
  );
};
