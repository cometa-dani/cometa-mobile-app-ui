import { StyleSheet } from 'react-native';
import { Text } from '../components/Themed';
import { ScrollView } from 'react-native-gesture-handler';
import { Link } from 'expo-router';


export default function StartScreen(): JSX.Element {
  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       router.push('/(app)/');
  //     }
  //     else {
  //       router.push('/(onboarding)/register');
  //     }
  //   });
  // }, []);
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Link href={'/(onboarding)/login'} >
        <Text style={styles.title}>Welcome Screen</Text>
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
