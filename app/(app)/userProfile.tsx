import { ScrollView, StyleSheet, Button, SafeAreaView, Image } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { StatusBar } from 'expo-status-bar';
import { useCometaStore } from '../../store/cometaStore';
import { useQueryGetUserProfileByUid } from '../../queries/userHooks';
import { CoButton } from '../../components/buttons/buttons';
import { CoCard } from '../../components/card/card';
import { FlatList } from 'react-native-gesture-handler';


export default function UserProfileScreen(): JSX.Element {
  const { gray500, background } = useColors();
  const uid = useCometaStore(state => state.uid); // this can be abstracted
  const { data: userProfile } = useQueryGetUserProfileByUid(uid);
  const totalFriends =
    (userProfile?._count.incomingFriendships || 0)
    +
    (userProfile?._count.outgoingFriendships || 0);

  const handleLogout = (): void => {
    signOut(auth);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={'auto'} />
      <ScrollView style={{ backgroundColor: background }}>
        <View style={styles.container}>

          <View style={styles.avatarContainer}>
            <View style={styles.avatarFigure}>
              <Image style={styles.avatar} source={{ uri: userProfile?.avatar }} />
              <Text style={styles.title}>
                {userProfile?.username}
              </Text>
              <Text style={{ color: gray500 }}>
                {userProfile?.description || 'Join me'}
              </Text>
            </View>

            <CoButton btnColor='white' text='Edit Profile' />

            <View style={styles.stats}>
              <View>
                <Text style={styles.statsNumber}>
                  {userProfile?._count.likedEvents}
                </Text>
                <Text style={[styles.statsTitle, { color: gray500 }]}>events</Text>
              </View>
              <View>
                <Text style={styles.statsNumber}>
                  {totalFriends}
                </Text>
                <Text style={[styles.statsTitle, { color: gray500 }]}>friends</Text>
              </View>
            </View>

            {false && (
              <Button onPress={() => handleLogout()} title='log out' />
            )}
          </View>

          <CoCard>
            <View style={styles.cardWrapper}>
              <Text style={{ fontSize: 18, fontWeight: '700' }}>BucketList</Text>

              <FlatList
                contentContainerStyle={{ gap: 12, justifyContent: 'center' }}
                showsHorizontalScrollIndicator={false}
                // pagingEnabled={true}
                // alwaysBounceHorizontal={false}
                horizontal={true}
                data={userProfile?.likedEvents}
                renderItem={({ item }) => (
                  <Image
                    style={styles.bucketListImage}
                    key={item.id}
                    source={{ uri: item.event.mediaUrl }}
                  />
                )}
              />
            </View>
          </CoCard>

          <CoCard>
            <View style={styles.cardWrapper}>
              <Text style={{ fontSize: 18, fontWeight: '700' }}>Photos</Text>

              <View style={{ minHeight: 150 }}>
                {userProfile?.photos.length === 0 ? (
                  <Text>No photos available</Text>
                ) : (
                  userProfile?.photos.map((photo) => (
                    <View key={photo.uuid}>{photo.uuid}</View>
                  ))
                )}
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

  bucketListImage: {
    borderRadius: 12,
    // flex: 1,
    height: 84,
    width: 130
  },

  cardWrapper: {
    // flex: 1,
    gap: 12
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
