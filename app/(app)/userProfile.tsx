import { ScrollView, StyleSheet, Button, SafeAreaView, Image } from 'react-native';
import { Text, View } from '../../components/Themed';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { StatusBar } from 'expo-status-bar';
import { useCometaStore } from '../../store/cometaStore';
import { useQueryGetUserProfile } from '../../queries/userHooks';


export default function UserProfileScreen(): JSX.Element {
  const uid = useCometaStore(state => state.uid);
  const { data: userProfile } = useQueryGetUserProfile(uid);

  const handleLogout = (): void => {
    signOut(auth);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={'auto'} />
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={styles.container}>

          <View>
            <Image style={styles.avatar} source={{ uri: userProfile?.avatar }} />
            <Text style={styles.title}>{userProfile?.username}</Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  avatar: {
    aspectRatio: 1,
    borderRadius: 100,
    height: 110
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 60
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
