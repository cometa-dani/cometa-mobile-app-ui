import { textStyleSheet } from '@/styles/textStyleSheet';
import { FC } from 'react';
import { NativeSyntheticEvent, StyleProp, Text, TextLayoutEventData, TextStyle } from 'react-native';
import { useStyles } from 'react-native-unistyles';


interface TextProps {
  children: React.ReactNode;
  bold?: boolean;
  style?: StyleProp<TextStyle>,
  ellipsis?: boolean,
  numberOfLines?: number,
  onPress?: () => void
  onTextLayout?: (event: NativeSyntheticEvent<TextLayoutEventData>) => void
}
export const TextView: FC<TextProps> = ({
  children,
  bold = false,
  style,
  ellipsis,
  numberOfLines = 1,
  onPress,
  onTextLayout
}) => {
  const { styles } = useStyles(textStyleSheet);
  return (
    <Text
      onPress={onPress && onPress}
      allowFontScaling={true}
      ellipsizeMode='tail'
      onTextLayout={onTextLayout}
      numberOfLines={ellipsis ? numberOfLines : undefined}
      style={[styles.font(bold), style]}
    >
      {children}
    </Text>
  );
};
