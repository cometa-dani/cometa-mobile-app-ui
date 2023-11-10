import { ScrollView, StyleSheet, Button, SafeAreaView } from 'react-native';
import { Text, View } from '../../components/Themed';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { StatusBar } from 'expo-status-bar';


export default function UserProfileScreen(): JSX.Element {

  const handleLogout = (): void => {
    signOut(auth);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={'auto'} />
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.title}>User Profile Screen</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
