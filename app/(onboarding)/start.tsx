import { StyleSheet } from 'react-native';
import { Text } from '../../components/Themed';
import { ScrollView } from 'react-native-gesture-handler';
import { Link } from 'expo-router';


export default function StartScreen(): JSX.Element {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Link href={'/(app)/'} >
        <Text style={styles.title}>Start Screen</Text>
      </Link>
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
