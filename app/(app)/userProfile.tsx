import { ScrollView, StyleSheet, Button, SafeAreaView, Image } from 'react-native';
import { Text, View } from '../../components/Themed';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { StatusBar } from 'expo-status-bar';
import { useCometaStore } from '../../store/cometaStore';
import { useQueryGetUserProfileByUid } from '../../queries/userHooks';
import { CoButton } from '../../components/buttons/buttons';


export default function UserProfileScreen(): JSX.Element {
  const uid = useCometaStore(state => state.uid); // this can be abstracted
  const { data: userProfile } = useQueryGetUserProfileByUid(uid);

  const handleLogout = (): void => {
    signOut(auth);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={'auto'} />
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={styles.container}>

          <View style={styles.avatarContainer}>

            <View style={styles.avatarFigure}>
              <Image style={styles.avatar} source={{ uri: userProfile?.avatar }} />
              <Text style={[styles.title, { fontSize: 32 }]}>{userProfile?.username}</Text>
              <Text style={styles.title}>{userProfile?.description || 'Join me'}</Text>
            </View>

            <CoButton btnColor='white' text='Edit Profile' />

            <View>
              <View>
                <Text>{userProfile?._count.likedEvents}</Text>
                <Text>events</Text>
              </View>
              <View>
                <Text></Text>
                <Text></Text>
              </View>
            </View>

            {false && (
              <Button onPress={() => handleLogout()} title='log out' />
            )}
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
    height: 110,
    margin: 'auto',
  },

  avatarContainer: {
    gap: 12
  },

  avatarFigure: {
    alignItems: 'center',
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
