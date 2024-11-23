import React, { FC } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, { useSharedValue, withSpring, interpolate, useDerivedValue } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


interface ProgressBarProps {
  value: number
}

export const ProgressBar: FC<ProgressBarProps> = ({ value }) => {
  const { styles } = useStyles(styleSheet);
  const progress = useSharedValue(0);
  const screenWidth = Dimensions.get('window').width;

  const progressWidth = useDerivedValue(() => {
    return interpolate(
      progress.value,
      [0, 100],
      [0, screenWidth],
    );
  });

  React.useEffect(() => {
    progress.value = withSpring(progress.value + value);
  }, [value]);

  return (
    <View style={styles.progressBar}>
      <Animated.View
        style={[
          styles.progress,
          {
            width: progressWidth,
          },
        ]}
      />
    </View>
  );
};


const styleSheet = createStyleSheet((theme) => ({
  progressBar: {
    height: theme.spacing.sp1,
    backgroundColor: theme.colors.white70,
    borderRadius: theme.radius.xs,
    overflow: 'hidden',
    width: '100%',
  },
  progress: {
    height: theme.spacing.sp1,
    backgroundColor: theme.colors.red80,
    opacity: 0.9,
    borderRadius: theme.radius.xs,
  }
}));
