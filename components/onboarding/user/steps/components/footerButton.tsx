import { Button } from '@/components/button/button';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { FC } from 'react';


interface IProps {
  onNext: () => void;
  text: string,
  isLoading?: boolean
}
export const FooterButton: FC<IProps> = ({ text, onNext, isLoading }) => {
  const { styles } = useStyles(styleSheet);
  return (
    <View style={styles.container}>
      <Button
        showLoading={isLoading}
        variant='primary'
        onPress={onNext}
      >
        {text}
      </Button>
    </View>
  );
};

const styleSheet = createStyleSheet((theme, runtime) => ({
  container: {
    width: '100%',
    paddingTop: theme.spacing.sp4,
    paddingBottom: runtime.insets.bottom,
    paddingHorizontal: theme.spacing.sp10
  }
}));
