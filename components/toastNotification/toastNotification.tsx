import { FC } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { TextView } from '../text/text';
import { AlertComponentProps } from 'react-native-notifier/lib/typescript/src/components/Alert';
import { SafeAreaView } from 'react-native-safe-area-context';


interface AlertComponentAllProps extends Partial<AlertComponentProps> {
  title?: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
}
const ToastNotification: FC<AlertComponentAllProps> = ({ title, description, type }) => {
  const { styles } = useStyles(styleSheet);
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea(type)}>
      <View style={styles.container}>
        <TextView ellipsis={true} style={styles.title}>
          {title}
        </TextView>
        <TextView ellipsis={true} numberOfLines={2} style={styles.description}>
          {description}
        </TextView>
      </View>
    </SafeAreaView>
  );
};

export const SucessToast: FC<AlertComponentAllProps> = ({ title, description }) => {
  return (
    <ToastNotification
      type='success'
      title={title ?? 'Success'}
      description={description}
    />
  );
};

export const ErrorToast: FC<AlertComponentAllProps> = ({ title, description }) => {
  return (
    <ToastNotification
      type='error'
      title={title ?? 'Error'}
      description={description}
    />
  );
};

export const InfoToast: FC<AlertComponentAllProps> = ({ title, description }) => {
  return (
    <ToastNotification
      type='info'
      title={title ?? 'Info'}
      description={description}
    />
  );
};


const styleSheet = createStyleSheet((theme, runtime) => ({
  safeArea: (type?: 'success' | 'error' | 'info') => ({
    backgroundColor: type && theme.colors[type],
  }),
  container: {
    paddingHorizontal: theme.spacing.sp8,
    paddingBottom: theme.spacing.sp4,
  },
  title: {
    fontSize: theme.text.size.s6,
    color: theme.colors.white100,
    fontFamily: theme.text.fontBold
  },
  description: {
    color: theme.colors.white100,
    fontFamily: theme.text.fontRegular
  },
}));
