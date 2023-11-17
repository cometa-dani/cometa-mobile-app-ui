import { ScrollView, StyleSheet, Button, SafeAreaView, Image, TextInput, Pressable } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { StatusBar } from 'expo-status-bar';
import { useCometaStore } from '../../store/cometaStore';
import { useMutationUploadUserPhotos, useQueryGetUserProfileByUid } from '../../queries/userHooks';
import { CoButton } from '../../components/buttons/buttons';
import { CoCard } from '../../components/card/card';
import { FlatList } from 'react-native-gesture-handler';
import { FC, useEffect, useRef, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
// import type { ImagePickerAsset } from 'expo-image-picker';
import { Photo } from '../../models/User';


// const pickedImg = {} as ImagePickerAsset;
// const initialValues = {
//   // imgsUris: ['', '', '', '', ''], // for rendering in the UI
//   imgFilesRef: [pickedImg, pickedImg, pickedImg, pickedImg, pickedImg] // for sending to the backend
// };

export default function UserProfileScreen(): JSX.Element {
  const { gray500, background } = useColors();
  const uid = useCometaStore(state => state.uid); // this can be abstracted

  // mutations
  const mutateUserPhotos = useMutationUploadUserPhotos();

  // queries
  const { data: userProfile } = useQueryGetUserProfileByUid(uid);
  const userPhotos: Photo[] = userProfile?.photos ?? [];
  const selectionLimit: number = (userProfile?.maxNumPhotos || 0) - (userPhotos?.length || 0);

  const totalFriends =
    (userProfile?._count.incomingFriendships || 0)
    +
    (userProfile?._count.outgoingFriendships || 0);

  // toggle edit mode
  const [toggleEdit, setToggleEdit] = useState(false);

  // edit user name & description
  const [name, setName] = useState(userProfile?.username || '');
  const [description, setDescription] = useState(userProfile?.description || 'Join me');
  const usernameRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);


  const handleSumitUserInfo = (): void => {
    // TODO: handle saving username, name & description
    setToggleEdit(false);
  };


  const handlePickImage = async () => {
    if (selectionLimit == 0) {
      // TODO: write logic to delete photos
      return;
    }
    else {
      // upload new photos
      try {
        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          selectionLimit, // only allows to select a number below the limit
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.canceled && userProfile?.id) {
          mutateUserPhotos.mutate({
            userID: userProfile?.id,
            pickedImgFiles: result.assets
          });
        }
      }
      catch (error) {
        console.log(error);
      }
    }
  };


  const handleLogout = (): void => {
    signOut(auth);
  };


  useEffect(() => {
    if (userProfile?.username) {
      setName(userProfile?.username);
    }
    if (userProfile?.description) {
      setDescription(userProfile.description);
    }
  }, [userProfile?.username, userProfile?.description]);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={'auto'} />

      {/* TODO: EDIT USER_NAME */}
      <Stack.Screen
        options={{
          headerShown: true, headerTitle: '@cesar_rivera', headerTitleAlign: 'center'
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: background }}
      >
        <View style={styles.container}>

          <View style={styles.avatarContainer}>
            <View style={styles.avatarFigure}>
              <Image style={styles.avatar} source={{ uri: userProfile?.avatar }} />

              {/* NAME */}
              {!toggleEdit ? (
                <Text style={styles.title}>
                  {name}
                </Text>
              ) : (
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ width: 24 }} />
                  <TextInput
                    style={styles.title}
                    onChangeText={(text) => setName(text)}
                    ref={usernameRef}
                    value={name}
                  />
                  <FontAwesome
                    onPress={() => usernameRef.current?.focus()}
                    style={{ fontSize: 24, top: 10 }}
                    name="edit"
                  />
                </View>
              )}
              {/* NAME */}


              {/* DESCRIPTION */}
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
              {/* DESCRIPTION */}
            </View>


            {/* EDIT BUTTON */}
            {toggleEdit ? (
              <CoButton onPress={() => handleSumitUserInfo()} btnColor='primary' text='Save Profile' />
            ) : (
              <CoButton onPress={() => setToggleEdit(true)} btnColor='white' text='Edit Profile' />
            )}


            {/* STATS */}
            <View style={styles.stats}>
              <View>
                <Text style={styles.statsNumber}>
                  {userProfile?._count.likedEvents}
                </Text>
                <Text style={{ color: gray500 }}>events</Text>
              </View>
              <View>
                <Text style={styles.statsNumber}>
                  {totalFriends}
                </Text>
                <Text style={{ color: gray500 }}>friends</Text>
              </View>
            </View>
            {/* STATS */}

            {/* TODO: LOG OUT */}
            {false && (
              <Button onPress={() => handleLogout()} title='log out' />
            )}
          </View>

          {/* BUCKETLIST */}
          {!toggleEdit && (
            <CoCard>
              <View style={styles.cardWrapper}>
                <Text style={{ fontSize: 17, fontWeight: '700' }}>BucketList</Text>

                <FlatList
                  contentContainerStyle={{ gap: 12, justifyContent: 'center' }}
                  showsHorizontalScrollIndicator={false}
                  // pagingEnabled={true}
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
          {/* BUCKETLIST */}


          {/* PHOTOS */}
          {!toggleEdit ? (
            <CoCard>
              <View style={styles.cardWrapper}>
                <Text style={{ fontSize: 17, fontWeight: '700' }}>Photos</Text>

                {userProfile?.photos.length === 0 ? (
                  <Text>No photos available</Text>
                ) : (
                  <Grid
                    photosList={userPhotos}
                    onHandlePickImage={() => null}
                  />
                )}
              </View>
            </CoCard>
          ) : (

            // UPLOAD PHOTOS
            <View style={styles.cardWrapper}>
              <Text style={{ fontSize: 22, fontWeight: '700' }}>Photos</Text>

              <Grid
                placeholders={selectionLimit}
                photosList={userPhotos}
                onHandlePickImage={handlePickImage}
              />

            </View>
            // UPLOAD PHOTOS
          )}

          {/* PHOTOS */}
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
    paddingVertical: 30
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

  title: {
    fontSize: 26,
    fontWeight: '700',
    textTransform: 'capitalize',
  }
});


interface Props {
  onHandlePickImage: () => void,
  photosList: Photo[],
  placeholders?: number
}
const Grid: FC<Props> = ({ onHandlePickImage, photosList, placeholders = 0 }) => {
  const { gray500 } = useColors();
  const placeholdersPhotos = (
    placeholders == 0 ?
      []
      :
      Array
        .from({ length: placeholders }, (_, index) => index)
        .map(() => ({} as Photo))
  );

  return (
    // <Pressable onPress={onHandlePickImage}>
    <View style={{ height: 150, flexDirection: 'row', gap: 12 }}>

      {/* col 1 */}
      <View style={{ flex: 1 }}>
        {photosList[0]?.url.length ? (
          <Image style={[gridStyles.uploadPhoto1, { objectFit: 'contain' }]} source={{ uri: photosList[0]?.url }} />
        ) : (
          <View style={gridStyles.uploadPhoto1}>
            <Pressable onPress={onHandlePickImage}>
              <FontAwesome style={{ fontSize: 34, color: gray500 }} name='plus-square-o' />
            </Pressable>
          </View>
        )}
      </View>
      {/* col 1 */}

      {/* grid */}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignContent: 'space-between'
        }}>

        {photosList?.slice(1).concat(placeholdersPhotos).map(({ url, uuid }, i) => (
          <View
            key={uuid ?? i}
            style={gridStyles.item}>
            {url?.length ? (
              <Image style={gridStyles.uploadPhotoGrid} source={{ uri: url }} />
            ) : (
              <View style={gridStyles.uploadPhotoGrid}>
                <Pressable onPress={onHandlePickImage}>
                  <FontAwesome style={{ fontSize: 28, color: gray500 }} name='plus-square-o' />
                </Pressable>
              </View>
            )}
          </View>
        ))}

      </View>
      {/* grid */}
    </View>
    // </Pressable>
  );
};


const gridStyles = StyleSheet.create({
  item: {
    height: '46.6%',
    width: '46.6%',
  },

  uploadPhoto1: {
    alignItems: 'center',
    backgroundColor: '#ead4fa',
    borderRadius: 26,
    flex: 1,
    justifyContent: 'center'
  },

  uploadPhotoGrid: {
    alignItems: 'center',
    backgroundColor: '#ead4fa',
    borderRadius: 26,
    flex: 1,
    justifyContent: 'center',
  }
});
