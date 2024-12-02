import React, { FC } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';


const screenWidth = UnistylesRuntime.screen.width;

interface ProgressBarProps {
  value: number,
  height?: number
}

export const ProgressBar: FC<ProgressBarProps> = ({ value, height = 6 }) => {
  const { styles } = useStyles(styleSheet);
  const progress = useSharedValue(0);

  React.useEffect(() => {
    const onePercent = screenWidth / 100;
    const increment = onePercent * (value % 101);
    progress.value = withTiming(increment, { duration: 800, easing: Easing.inOut(Easing.quad) });
  }, [value]);

  return (
    <View style={[styles.progressBar, { height }]}>
      <Animated.View
        style={[
          styles.progress,
          {
            height,
            width: progress,
          },
        ]}
      />
    </View>
  );
};


const styleSheet = createStyleSheet((theme) => ({
  progressBar: {
    backgroundColor: theme.colors.white80,
    borderRadius: 99_999,
    overflow: 'hidden',
    width: '100%',
  },
  progress: {
    backgroundColor: theme.colors.red80,
    opacity: 0.7,
    borderRadius: 99_999,
  }
}));
