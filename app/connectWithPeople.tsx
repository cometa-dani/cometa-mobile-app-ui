import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';


export default function ConnectWithPeopleScreen(): JSX.Element {
  return (
    <>
      <StatusBar style={'auto'} />

      <View style={styles.container}>
        <Text style={styles.title}>Connect with like-minded People</Text>

      </View>
    </>
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
