import { textStyleSheet } from '@/styles/textStyleSheet';
import { FC } from 'react';
import { Text } from 'react-native';
import { useStyles } from 'react-native-unistyles';


interface Props {
  children: React.ReactNode;
  size?: 's1' | 's2' | 's4' | 's6' | 's7' | 's8' | 's10' | 's12' | 's14'
}

export const Heading: FC<Props> = ({ children, size }) => {
  const { styles, theme } = useStyles(textStyleSheet);
  return (
    <Text style={styles.heading(theme.text.size[size || 's4'])}>{children}</Text>
  );
};
