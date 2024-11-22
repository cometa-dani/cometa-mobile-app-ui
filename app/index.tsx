import { Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import '@/components/unistyles';


export default function App() {
  const { styles } = useStyles(stylesheet);
  return (
    <>
      <Stack.Screen
        options={{ animation: 'slide_from_right' }}
      />
      <View style={styles.container}>
        <Text>Lets go!</Text>
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    backgroundColor: theme.colors.white50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
}));
