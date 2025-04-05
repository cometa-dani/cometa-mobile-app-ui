import { FC } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


export const Indicator: FC = () => {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.notificationIndicator} />
  );
};

const stylesheet = createStyleSheet((theme) => ({
  notificationIndicator: {
    borderRadius: 99_999,
    width: 8,
    height: 8,
    backgroundColor: theme.colors.red100,
    position: 'absolute',
    top: -2
  }
}));
