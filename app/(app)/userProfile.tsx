import { ScrollView, Button, SafeAreaView, Image, TextInput, Pressable } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { StatusBar } from 'expo-status-bar';
import { useCometaStore } from '../../store/cometaStore';
import { useMutationDeleteUserPhotoByUuid, useMutationUpdateUserAvatar, useMutationUploadUserPhotos, useMutationUserProfileById, useQueryGetUserProfileByUid } from '../../queries/userHooks';
import { AppButton } from '../../components/buttons/buttons';
import { AppCard } from '../../components/card/card';
import { useRef, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Photo } from '../../models/User';
import { AppCarousel } from '../../components/carousels/carousel';
import { profileStyles } from '../../components/profile/profileStyles';
import { AppStats } from '../../components/stats/Stats';
import { AppProfileAvatar } from '../../components/profile/profileAvatar';
import { AppPhotosGrid } from '../../components/profile/photosGrid';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';


type ProfileValues = {
  name: string,
  biography: string
}

const validationSchemma = Yup.object<ProfileValues>({
  name: Yup.string().min(3).max(26).required(),
  biography: Yup.string().min(5).max(32).required()
});

export default function UserProfileScreen(): JSX.Element {
  const { gray500, background } = useColors();
  const uid = useCometaStore(state => state.uid); // this can be abstracted

  // mutations
  const mutateUserPhotosUpload = useMutationUploadUserPhotos(uid);
  const mutateUserPhotosDelete = useMutationDeleteUserPhotoByUuid(uid);
  const mutateUserAvatarImg = useMutationUpdateUserAvatar(uid);
  const mutateUserProfileById = useMutationUserProfileById();

  // queries
  const { data: userProfile, isSuccess } = useQueryGetUserProfileByUid(uid);
  const userPhotos: Photo[] = userProfile?.photos ?? [];
  const selectionLimit: number = (userProfile?.maxNumPhotos || 5) - (userPhotos?.length || 0);

  const totalFriends =
    (userProfile?._count.incomingFriendships || 0)
    +
    (userProfile?._count.outgoingFriendships || 0);

  // toggle edit mode
  const [toggleEdit, setToggleEdit] = useState(false);
  const usernameRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);

  /**
   * 
   * @description upload avatar image
   */
  const handlePickAvatarImg = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
      if (!result.canceled && userProfile?.id) {
        mutateUserAvatarImg.mutate({
          userID: userProfile?.id,
          pickedImgFile: result.assets[0]
        });
      }
    }
    catch (error) {
      // console.log(error);
    }
  };

  const handleSumitUserInfo =
    async (values: ProfileValues, actions: FormikHelpers<ProfileValues>): Promise<void> => {
      mutateUserProfileById.mutate({ userId: userProfile?.id as number, payload: values });
      actions.setSubmitting(false);
    };


  const handlePickMultipleImages = async () => {
    if (selectionLimit == 0) {
      return;
    }
    else {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          selectionLimit, // only allows to select a number below the limit
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.canceled && userProfile?.id) {
          mutateUserPhotosUpload.mutate({
            userID: userProfile?.id,
            pickedImgFiles: result.assets
          });
        }
      }
      catch (error) {
        // console.log(error);
      }
    }
  };


  const handleDeleteImage = async (photoUuid: string) => {
    mutateUserPhotosDelete.mutate({ userID: userProfile?.id as number, photoUuid });
  };


  const handleLogout = (): void => {
    signOut(auth);
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={'auto'} />

      {/* TODO: EDIT USER_NAME */}
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: userProfile?.username || '',
          headerTitleAlign: 'center'
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: background }}
      >
        <View style={profileStyles.container}>
          <View style={profileStyles.avatarContainer}>

            <Formik
              enableReinitialize
              validationSchema={validationSchemma}
              initialValues={{ name: userProfile?.name || '', biography: userProfile?.biography || '' }}
              onSubmit={handleSumitUserInfo}
            >
              {({ handleBlur, handleChange, handleSubmit, values }) => (
                <>
                  {
                    !toggleEdit ? (
                      <AppProfileAvatar
                        avatar={userProfile?.avatar}
                        biography={values.biography}
                        name={values.name}
                      />
                    ) : (
                      <View style={profileStyles.avatarFigure}>

                        <Pressable onPress={() => handlePickAvatarImg()}>
                          <Image style={profileStyles.avatar} source={{ uri: userProfile?.avatar }} />
                        </Pressable>

                        {/* NAME */}
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                          <View style={{ width: 24 }} />
                          <TextInput
                            style={profileStyles.title}
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            ref={usernameRef}
                            value={values.name}
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
                            onChangeText={handleChange('biography')}
                            onBlur={handleBlur('biography')}
                            ref={descriptionRef}
                            value={values.biography}
                          />

                          <FontAwesome
                            onPress={() => descriptionRef.current?.focus()}
                            style={{ fontSize: 18, top: 5 }}
                            name="edit"
                          />
                        </View>
                        {/* DESCRIPTION */}
                      </View>
                    )
                  }

                  {toggleEdit ? (
                    // submit button
                    <AppButton
                      onPress={() => {
                        handleSubmit();
                        setToggleEdit(false);
                      }}
                      btnColor='primary'
                      text='Save Profile'
                    />
                  ) : (
                    // toggle button
                    <AppButton
                      onPress={() => setToggleEdit(true)}
                      btnColor='white'
                      text='Edit Profile'
                    />
                  )}
                </>
              )}
            </Formik>


            {/* STATISTICS */}
            <AppStats
              totalEvents={userProfile?._count.likedEvents || 0}
              totalFriends={totalFriends}
            />
            {/* STATISTICS */}
          </View>

          {/* BUCKETLIST */}
          {!toggleEdit && (
            <AppCarousel
              list={
                userProfile
                  ?.likedEvents
                  .map(
                    (item) => item.event.mediaType === 'VIDEO' ?
                      ({ id: item.id, img: '' })
                      :
                      ({ id: item.id, img: item.event?.mediaUrl })
                  )
                || []
              }
              title='BucketList'
            />
          )}
          {/* BUCKETLIST */}

          {/* PHOTOS */}
          {isSuccess && (
            !toggleEdit ? (
              <AppCard>
                <View style={profileStyles.cardWrapper}>
                  <Text style={{ fontSize: 17, fontWeight: '700' }}>Photos</Text>

                  {userProfile?.photos.length === 0 ? (
                    <Text>No photos available</Text>
                  ) : (
                    <AppPhotosGrid photosList={userPhotos} />
                  )}
                </View>
              </AppCard>
            ) : (
              // UPLOAD PHOTOS
              <View style={profileStyles.cardWrapper}>
                <Text style={{ fontSize: 22, fontWeight: '700' }}>Photos</Text>

                <AppPhotosGrid
                  photosList={userPhotos}
                  onHandlePickImage={handlePickMultipleImages}
                  onDeleteImage={handleDeleteImage}
                  placeholders={selectionLimit}
                />

              </View>
              // UPLOAD PHOTOS
            )
          )}
          {/* PHOTOS */}

          {/* TODO: LOG OUT */}
          <Button onPress={() => handleLogout()} title='log out' />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
