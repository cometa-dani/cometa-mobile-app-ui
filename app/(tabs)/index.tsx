import { StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';


export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cometa Dani App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
