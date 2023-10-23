import { ScrollView, StyleSheet } from 'react-native';
import { Text } from '../../components/Themed';


export default function UserProfileScreen(): JSX.Element {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Text style={styles.title}>User Profile Screen</Text>
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
