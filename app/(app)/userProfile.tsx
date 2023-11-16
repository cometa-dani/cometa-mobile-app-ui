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
import { useEffect, useRef, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import type { ImagePickerAsset } from 'expo-image-picker';


const pickedImg = {} as ImagePickerAsset;
const initialValues = {
  imgsUris: ['', '', '', '', ''],
  imgFilesRef: [pickedImg, pickedImg, pickedImg, pickedImg, pickedImg]
};

export default function UserProfileScreen(): JSX.Element {
  const { gray500, background } = useColors();
  const uid = useCometaStore(state => state.uid); // this can be abstracted

  // queries
  const { data: userProfile } = useQueryGetUserProfileByUid(uid);
  const totalFriends =
    (userProfile?._count.incomingFriendships || 0)
    +
    (userProfile?._count.outgoingFriendships || 0);

  // mutations
  const mutateUserInfo = useMutationUploadUserPhotos();

  // edit
  const [username, setUsername] = useState(userProfile?.username || '');
  const [description, setDescription] = useState(userProfile?.description || 'Join me');
  const [toggleEdit, setToggleEdit] = useState(false);
  const usernameRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);

  // modal/img-picker
  const [pickedimgsUriList, setPickedImgsUriList] = useState<string[]>(initialValues.imgsUris);
  const pickedImagesListRef = useRef<ImagePickerAsset[]>(initialValues.imgFilesRef);


  const handleSumitUserInfo = (): void => {
    const pickedImages = pickedImagesListRef.current.filter(imgFile => imgFile?.uri?.length);

    // 1. sending photos to server
    if (userProfile?.id && pickedImages.length) {
      mutateUserInfo.mutate({
        userID: userProfile?.id,
        pickedImgFiles: pickedImages
      });
    }

    // 2. cleaning client state 

    // setToggleEdit(false);
    // setImageUri(initialValues.imgsUris);
    // imgFilesRef.current = initialValues.imgFilesRef;
  };


  const handlePickImage = async (photo: number) => {
    try {
      // No permissions request is necessary for launching the image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        pickedImagesListRef.current[photo] = result.assets[0];

        setPickedImgsUriList(prev => {
          if (pickedImagesListRef.current[photo]?.uri) {
            prev[photo] = pickedImagesListRef.current[photo]?.uri;
          }
          return [...prev];
        });
      }
    }
    catch (error) {
      console.log(error);
    }
  };


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

                <View style={{ minHeight: 150 }}>
                  {userProfile?.photos.length === 0 ? (
                    <Text>No photos available</Text>
                  ) : (
                    userProfile?.photos.map((photo) => (
                      <Text key={photo.uuid}>{photo.url}</Text>
                    ))
                  )}
                </View>
              </View>
            </CoCard>

          ) : (
            // UPLOAD PHOTOS
            <View style={styles.cardWrapper}>
              <Text style={{ fontSize: 22, fontWeight: '700' }}>Photos</Text>

              <View style={{ height: 150, flexDirection: 'row', gap: 12 }}>

                {/* col 1 */}
                <Pressable onPress={() => handlePickImage(0)} style={{ flex: 1 }}>
                  {pickedimgsUriList[0].length ? (
                    <Image style={[styles.uploadPhoto1, { objectFit: 'contain' }]} source={{ uri: pickedimgsUriList[0] }} />
                  ) : (
                    <View style={styles.uploadPhoto1}>
                      <FontAwesome style={{ fontSize: 34, color: gray500 }} name='plus-square-o' />
                    </View>
                  )}
                </Pressable>

                {/* grid */}
                <View style={{ flex: 1, gap: 12 }}>

                  <View style={{ flexDirection: 'row', gap: 12, flex: 0.5 }}>
                    <Pressable onPress={() => handlePickImage(1)} style={{ flex: 1 }}>
                      {pickedimgsUriList[1].length ? (
                        <Image style={styles.uploadPhotoGrid} source={{ uri: pickedimgsUriList[1] }} />
                      ) : (
                        <View style={styles.uploadPhotoGrid}>
                          <FontAwesome style={{ fontSize: 28, color: gray500 }} name='plus-square-o' />
                        </View>
                      )}
                    </Pressable>

                    <Pressable onPress={() => handlePickImage(2)} style={{ flex: 1 }}>
                      {pickedimgsUriList[2].length ? (
                        <Image style={styles.uploadPhotoGrid} source={{ uri: pickedimgsUriList[2] }} />
                      ) : (
                        <View style={styles.uploadPhotoGrid}>
                          <FontAwesome style={{ fontSize: 28, color: gray500 }} name='plus-square-o' />
                        </View>
                      )}
                    </Pressable>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 12, flex: 0.5 }}>
                    <Pressable onPress={() => handlePickImage(3)} style={{ flex: 1 }}>
                      {pickedimgsUriList[3].length ? (
                        <Image style={styles.uploadPhotoGrid} source={{ uri: pickedimgsUriList[3] }} />
                      ) : (
                        <View style={styles.uploadPhotoGrid}>
                          <FontAwesome style={{ fontSize: 28, color: gray500 }} name='plus-square-o' />
                        </View>
                      )}
                    </Pressable>
                    <Pressable onPress={() => handlePickImage(4)} style={{ flex: 1 }}>
                      {pickedimgsUriList[4].length ? (
                        <Image style={styles.uploadPhotoGrid} source={{ uri: pickedimgsUriList[4] }} />
                      ) : (
                        <View style={styles.uploadPhotoGrid}>
                          <FontAwesome style={{ fontSize: 28, color: gray500 }} name='plus-square-o' />
                        </View>
                      )}
                    </Pressable>
                  </View>
                </View>
              </View>
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
    justifyContent: 'center'
  },
});
