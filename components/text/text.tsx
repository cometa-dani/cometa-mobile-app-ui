import { textStyleSheet } from '@/styles/textStyleSheet';
import { FC } from 'react';
import { Text } from 'react-native';
import { useStyles } from 'react-native-unistyles';


interface TextProps {
  children: React.ReactNode;
  bold?: boolean;
}

export const TextView: FC<TextProps> = ({ children, bold = false }) => {
  const { styles } = useStyles(textStyleSheet);
  return (
    <Text style={styles.font(bold)}>{children}</Text>
  );
};
