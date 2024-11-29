import { TextView } from '@/components/text/text';
import { Stack } from 'expo-router';
import { Platform, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


export default function OnboardUser() {
  const { styles } = useStyles(styleSheet);
  return (
    <>
      <Stack.Screen
        options={{
          gestureDirection: 'vertical',
          fullScreenGestureEnabled: true,
          gestureEnabled: true,
          headerShadowVisible: false,
          headerShown: Platform.select({
            ios: false,
            android: true
          }),
          headerTitle: '',
          animationDuration: 280,
          animation: 'slide_from_bottom',
        }}
      />
      <View style={styles.container}>
        <TextView>Onboard user</TextView>
      </View>
    </>
  );
}

const styleSheet = createStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.white100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
}));
