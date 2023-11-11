import { ScrollView, StyleSheet, Button, SafeAreaView, Image } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { StatusBar } from 'expo-status-bar';
import { useCometaStore } from '../../store/cometaStore';
import { useQueryGetUserProfileByUid } from '../../queries/userHooks';
import { CoButton } from '../../components/buttons/buttons';
import { CoCard } from '../../components/card/card';


export default function UserProfileScreen(): JSX.Element {
  const { textContent } = useColors();
  const uid = useCometaStore(state => state.uid); // this can be abstracted
  const { data: userProfile } = useQueryGetUserProfileByUid(uid);
  const totalFriends = (
    userProfile?._count.incomingFriendships || 0)
    +
    (userProfile?._count.outgoingFriendships || 0
    );

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
              <Text style={styles.title}>
                {userProfile?.username}
              </Text>
              <Text style={{ color: textContent }}>
                {userProfile?.description || 'Join me'}
              </Text>
            </View>

            <CoButton btnColor='white' text='Edit Profile' />

            <View style={styles.stats}>
              <View>
                <Text style={styles.statsNumber}>
                  {userProfile?._count.likedEvents}
                </Text>
                <Text style={[styles.statsTitle, { color: textContent }]}>events</Text>
              </View>
              <View>
                <Text style={styles.statsNumber}>
                  {totalFriends}
                </Text>
                <Text style={[styles.statsTitle, { color: textContent }]}>friends</Text>
              </View>
            </View>

            {false && (
              <Button onPress={() => handleLogout()} title='log out' />
            )}
          </View>

          <CoCard>
            <View style={styles.bucketList}>
              <Text>BucketList</Text>

              <View style={styles.bucketListImages}>
                {userProfile?.likedEvents.map((eventLike) => (
                  <Image
                    style={styles.bucketListImage}
                    key={eventLike.id}
                    source={{ uri: eventLike.event.mediaUrl }}
                  />
                ))}
              </View>
            </View>
          </CoCard>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  avatar: {
    aspectRatio: 1,
    borderRadius: 100,
    height: 100,
    margin: 'auto',
  },

  avatarContainer: {
    gap: 14
  },

  avatarFigure: {
    alignItems: 'center',
  },

  bucketList: {
    gap: 12
  },

  bucketListImage: {
    borderRadius: 12,
    flex: 1,
    height: 80
  },


  bucketListImages: {
    flexDirection: 'row',
    gap: 14
  },

  container: {
    flex: 1,
    gap: 24,
    paddingHorizontal: 20,
    paddingVertical: 60
  },

  stats: {
    flexDirection: 'row',
    gap: 50,
    justifyContent: 'center'
  },

  statsNumber: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center'
  },

  statsTitle: {
    // fontSize: 18
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});
