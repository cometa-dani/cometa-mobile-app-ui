import { FC } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface IndicatorProps {
  position?: number
}
export const Indicator: FC<IndicatorProps> = ({ position }) => {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={[styles.notificationIndicator, { left: position }]} />
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
