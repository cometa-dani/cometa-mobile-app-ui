import { ScrollView, Button, SafeAreaView, Image, TextInput } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { StatusBar } from 'expo-status-bar';
import { useCometaStore } from '../../store/cometaStore';
import { useMutationUploadUserPhotos, useQueryGetUserProfileByUid } from '../../queries/userHooks';
import { CoButton } from '../../components/buttons/buttons';
import { CoCard } from '../../components/card/card';
import { useEffect, useRef, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Photo } from '../../models/User';
import { HorizontalCarousel } from '../../components/carousels/horizaontalCarousel';
import { profileStyles } from '../../components/profile/profileStyles';
import { Stats } from '../../components/stats/Stats';
import { ProfileAvatar } from '../../components/profile/profileAvatar';
import { PhotosGrid } from '../../components/profile/photosGrid';


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
        <View style={profileStyles.container}>
          <View style={profileStyles.avatarContainer}>

            {!toggleEdit ? (
              <ProfileAvatar
                avatar={userProfile?.avatar}
                description={description}
                name={name}
              />
            ) : (
              <View style={profileStyles.avatarFigure}>
                <Image style={profileStyles.avatar} source={{ uri: userProfile?.avatar }} />
                {/* NAME */}
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ width: 24 }} />
                  <TextInput
                    style={profileStyles.title}
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
                {/* NAME */}

                {/* DESCRIPTION */}
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
                {/* DESCRIPTION */}
              </View>
            )}


            {/* EDIT BUTTON */}
            {toggleEdit ? (
              <CoButton onPress={() => handleSumitUserInfo()} btnColor='primary' text='Save Profile' />
            ) : (
              <CoButton onPress={() => setToggleEdit(true)} btnColor='white' text='Edit Profile' />
            )}

            <Stats
              totalEvents={userProfile?._count.likedEvents || 0}
              totalFriends={totalFriends}
            />

            {/* TODO: LOG OUT */}
            {false && (
              <Button onPress={() => handleLogout()} title='log out' />
            )}
          </View>

          {/* BUCKETLIST */}
          {!toggleEdit && (
            <HorizontalCarousel
              list={userProfile?.likedEvents.map(item => ({ id: item.id, img: item.event.mediaUrl })) || []}
              title='BucketList'
            />
          )}
          {/* BUCKETLIST */}


          {/* PHOTOS */}
          {!toggleEdit ? (
            <CoCard>
              <View style={profileStyles.cardWrapper}>
                <Text style={{ fontSize: 17, fontWeight: '700' }}>Photos</Text>

                {userProfile?.photos.length === 0 ? (
                  <Text>No photos available</Text>
                ) : (
                  <PhotosGrid photosList={userPhotos} />
                )}
              </View>
            </CoCard>
          ) : (
            // UPLOAD PHOTOS
            <View style={profileStyles.cardWrapper}>
              <Text style={{ fontSize: 22, fontWeight: '700' }}>Photos</Text>

              <PhotosGrid
                photosList={userPhotos}
                onHandlePickImage={handlePickImage}
                placeholders={selectionLimit}
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
