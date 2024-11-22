import { textStyleSheet } from '@/styles/textStyleSheet';
import { FC } from 'react';
import { Text } from 'react-native';
import { useStyles } from 'react-native-unistyles';


interface Props {
  children: React.ReactNode;
  size?: 'xxxl' | 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
}

export const Heading: FC<Props> = ({ children, size }) => {
  const { styles, theme } = useStyles(textStyleSheet);
  return (
    <Text style={styles.heading(theme.text.size[size || 'md'])}>{children}</Text>
  );
};
