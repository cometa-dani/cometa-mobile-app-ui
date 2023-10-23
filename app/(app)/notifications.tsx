import { ScrollView, StyleSheet } from 'react-native';
import { Text } from '../../components/Themed';


export default function NotificationsScreen(): JSX.Element {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Text style={styles.title}>Notifications Screen</Text>
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
