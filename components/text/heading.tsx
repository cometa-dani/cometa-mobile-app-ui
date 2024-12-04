import { textStyleSheet } from '@/styles/textStyleSheet';
import { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { useStyles } from 'react-native-unistyles';


interface Props {
  children: React.ReactNode;
  size?: 's1' | 's2' | 's4' | 's6' | 's7' | 's8' | 's10' | 's12' | 's14',
  ellipsis?: boolean,
  style?: StyleProp<TextStyle>,
}

export const Heading: FC<Props> = ({ children, size, ellipsis, style }) => {
  const { styles, theme } = useStyles(textStyleSheet);
  return (
    <Text
      ellipsizeMode='tail'
      numberOfLines={ellipsis ? 1 : undefined}
      style={[styles.heading(theme.text.size[size || 's4']), style]}
    >
      {children}
    </Text>
  );
};
