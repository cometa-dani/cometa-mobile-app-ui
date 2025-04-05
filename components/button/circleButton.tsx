import { FC, ReactNode } from 'react';
import { TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


interface CircleButtonProps {
  children: ReactNode,
  size?: number,
  onPress?: () => void,
  opacity?: number,
  light?: boolean
}
export const CircleButton: FC<CircleButtonProps> = ({ children, size = 34, onPress, opacity = 0.16, light = true }) => {
  const { styles } = useStyles(stylesheet);
  return (
    <TouchableOpacity
      style={[styles.cirleButton(opacity, light), { width: size }]}
      onPress={onPress && onPress}
    >
      {children}
    </TouchableOpacity>
  );
};


const stylesheet = createStyleSheet((theme) => ({
  cirleButton: (opacity: number, light: boolean) => {
    const backgroundColor = light ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`;
    return ({
      marginLeft: theme.spacing.sp4,
      backgroundColor,
      aspectRatio: 1,
      borderRadius: 99_999,
      zIndex: 0,
      alignItems: 'center',
      justifyContent: 'center'
    });
  }
}));
