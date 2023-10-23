import { StyleSheet } from 'react-native';
import { Text } from '../../components/Themed';
import { ScrollView } from 'react-native-gesture-handler';


export default function LoginScreen(): JSX.Element {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Text style={styles.title}>Login Screen</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
