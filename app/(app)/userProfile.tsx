import { ScrollView, StyleSheet, Button, SafeAreaView, Image, TextInput } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { StatusBar } from 'expo-status-bar';
import { useCometaStore } from '../../store/cometaStore';
import { useQueryGetUserProfileByUid } from '../../queries/userHooks';
import { CoButton } from '../../components/buttons/buttons';
import { CoCard } from '../../components/card/card';
import { FlatList } from 'react-native-gesture-handler';
import { useEffect, useRef, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';


export default function UserProfileScreen(): JSX.Element {
  const { gray500, background } = useColors();
  const uid = useCometaStore(state => state.uid); // this can be abstracted

  // queries
  const { data: userProfile } = useQueryGetUserProfileByUid(uid);
  const [username, setUsername] = useState(userProfile?.username || '');
  const [description, setDescription] = useState(userProfile?.description || 'Join me');
  const totalFriends =
    (userProfile?._count.incomingFriendships || 0)
    +
    (userProfile?._count.outgoingFriendships || 0);

  // edit
  const [toggleEdit, setToggleEdit] = useState(false);
  const usernameRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);

  const handleLogout = (): void => {
    signOut(auth);
  };

  useEffect(() => {
    if (userProfile?.username) {
      setUsername(userProfile?.username);
    }
    if (userProfile?.description) {
      setDescription(userProfile.description);
    }
  }, [userProfile?.username, userProfile?.description]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={'auto'} />
      <ScrollView style={{ backgroundColor: background }}>
        <View style={styles.container}>

          <View style={styles.avatarContainer}>
            <View style={styles.avatarFigure}>
              <Image style={styles.avatar} source={{ uri: userProfile?.avatar }} />

              {!toggleEdit ? (
                <Text style={styles.title}>
                  {username}
                </Text>

              ) : (

                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ width: 24 }} />
                  <TextInput
                    style={styles.title}
                    onChangeText={(text) => setUsername(text)}
                    ref={usernameRef}
                    value={username}
                  />
                  <FontAwesome
                    onPress={() => usernameRef.current?.focus()}
                    style={{ fontSize: 24, top: 10 }}
                    name="edit"
                  />
                </View>
              )}

              {!toggleEdit ? (
                <Text style={{ color: gray500, padding: 0 }}>
                  {description}
                </Text>
              ) : (
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ width: 16 }} />

                  <TextInput
                    style={{ color: gray500, padding: 0 }}
                    onChangeText={(text) => setDescription(text)}
                    ref={descriptionRef}
                    value={description}
                  />

                  <FontAwesome
                    onPress={() => descriptionRef.current?.focus()}
                    style={{ fontSize: 18, top: 5 }}
                    name="edit"
                  />
                </View>
              )}
            </View>

            {toggleEdit ? (
              <CoButton onPress={() => setToggleEdit(false)} btnColor='primary' text='Save Profile' />
            ) : (
              <CoButton onPress={() => setToggleEdit(true)} btnColor='white' text='Edit Profile' />
            )}

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

          {!toggleEdit && (
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
          )}

          {!toggleEdit ? (
            <CoCard>
              <View style={styles.cardWrapper}>
                <Text style={{ fontSize: 18, fontWeight: '700' }}>Photos</Text>

                <View style={{ minHeight: 140 }}>
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

          ) : (
            <View style={styles.cardWrapper}>
              <Text style={{ fontSize: 24, fontWeight: '700' }}>Photos</Text>
            </View>
          )}
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
    height: 84,
    width: 130
  },

  cardWrapper: {
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
