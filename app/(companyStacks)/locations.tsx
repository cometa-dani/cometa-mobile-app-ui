import { TextView } from '@/components/text/text';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


export default function LocationsScreen() {
  const { styles } = useStyles(stylesheet);
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Locations',
          headerTitleAlign: 'center'
        }}
      />
      <View style={styles.container}>
        <TextView>Locations</TextView>
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    backgroundColor: theme.colors.white100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
}));
