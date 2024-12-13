import { textStyleSheet } from '@/styles/textStyleSheet';
import { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { useStyles } from 'react-native-unistyles';


interface TextProps {
  children: React.ReactNode;
  bold?: boolean;
  style?: StyleProp<TextStyle>,
  ellipsis?: boolean,
  numberOfLines?: number,
  onPress?: () => void
}
export const TextView: FC<TextProps> = ({ children, bold = false, style, ellipsis, numberOfLines = 1, onPress }) => {
  const { styles } = useStyles(textStyleSheet);
  return (
    <Text
      onPress={onPress && onPress}
      allowFontScaling={true}
      ellipsizeMode='tail'
      numberOfLines={ellipsis ? numberOfLines : undefined}
      style={[styles.font(bold), style]}
    >
      {children}
    </Text>
  );
};
