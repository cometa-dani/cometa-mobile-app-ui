import { FC, ReactNode } from 'react';
import { TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


interface CircleButtonProps {
  children: ReactNode,
  size?: number,
  onPress: () => void
}
export const CircleButton: FC<CircleButtonProps> = ({ children, size = 34, onPress }) => {
  const { styles } = useStyles(stylesheet);
  return (
    <TouchableOpacity
      style={[styles.cirleButton, { width: size }]}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};


const stylesheet = createStyleSheet((theme) => ({
  cirleButton: {
    marginLeft: theme.spacing.sp4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    aspectRatio: 1,
    borderRadius: 99_999,
    zIndex: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
}));
