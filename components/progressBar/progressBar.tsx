import React, { FC } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';


const screenWidth = UnistylesRuntime.screen.width;

interface ProgressBarProps {
  value: number
}

export const ProgressBar: FC<ProgressBarProps> = ({ value }) => {
  const { styles } = useStyles(styleSheet);
  const progress = useSharedValue(0);

  React.useEffect(() => {
    const onePercent = screenWidth / 100;
    const increment = onePercent * (value % 101);
    progress.value = withTiming(increment, { duration: 800, easing: Easing.inOut(Easing.quad) });
  }, [value]);

  return (
    <View style={styles.progressBar}>
      <Animated.View
        style={[
          styles.progress,
          {
            width: progress,
          },
        ]}
      />
    </View>
  );
};


const styleSheet = createStyleSheet((theme) => ({
  progressBar: {
    height: 4.2,
    backgroundColor: theme.colors.white80,
    borderRadius: theme.radius.xs,
    overflow: 'hidden',
    width: '100%',
  },
  progress: {
    height: 6,
    backgroundColor: theme.colors.red80,
    opacity: 0.7,
    borderRadius: theme.radius.xs,
  }
}));
