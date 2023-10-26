import { ScrollView, StyleSheet, Button } from 'react-native';
import { Text } from '../../components/Themed';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';


export default function UserProfileScreen(): JSX.Element {

  const handleLogout = (): void => {
    signOut(auth);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Text style={styles.title}>User Profile Screen</Text>
      <Button
        title='Log Out'
        onPress={() => handleLogout()}
      />
    </ScrollView >
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
