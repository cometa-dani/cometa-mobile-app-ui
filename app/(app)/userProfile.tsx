import { ScrollView, Button, SafeAreaView, TextInput, Pressable, Dimensions, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Text, View, useColors } from '../../components/Themed';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useCometaStore } from '../../store/cometaStore';
import { useMutationDeleteUserPhotoByUuid, useMutationUpdateUserAvatar, useMutationUploadUserPhotos, useMutationUserProfileById, useQueryGetUserProfileByUid } from '../../queries/userHooks';
import { AppButton } from '../../components/buttons/buttons';
import { useRef, useState } from 'react';
import { Stack, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Photo } from '../../models/User';
import { AppCarousel } from '../../components/carousels/carousel';
import { profileStyles } from '../../components/profile/profileStyles';
// import { AppStats } from '../../components/stats/Stats';
// import { AppProfileAvatar } from '../../components/profile/profileAvatar';
// import { AppPhotosGrid } from '../../components/profile/photosGrid';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';
import { Badges, badgesStyles } from '../../components/profile/badges';
import { ProfileCarousel } from '../../components/profile/profileCarousel';
import { ProfileHeader } from '../../components/profile/profileHeader';
import { AppPhotosGrid } from '../../components/profile/photosGrid';
import { FontAwesome } from '@expo/vector-icons';
import { AppLabelFeedbackMsg, AppTextInput } from '../../components/textInput/AppTextInput';
import { gray_100, gray_200, gray_300, gray_500 } from '../../constants/colors';
import { AppCard } from '../../components/card/card';
import { BaseButton } from 'react-native-gesture-handler';

// const eventItemEstimatedHeight = Dimensions.get('window').height - 160;
// const carouselEstimatedWidth = Dimensions.get('window').width;

type ProfileValues = {
  occupation: string,
  biography: string,
  location: string,
  homeTown: string
}

const validationSchemma = Yup.object<ProfileValues>({
  occupation: Yup.string().min(5).max(32).required(),
  biography: Yup.string().min(5).max(120).required(),
  location: Yup.string().optional(),
  homeTown: Yup.string().optional()
});

export default function UserProfileScreen(): JSX.Element {

  const queryClient = useQueryClient();
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
  const [toggleEdit, setToggleEdit] = useState(true);
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
    queryClient.clear();
    queryClient.removeQueries();
    queryClient.cancelQueries();
    signOut(auth);
  };

  // console.log(userProfile?.birthday);
  return (
    <SafeAreaView style={{ flex: 1 }}>

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
        {toggleEdit && (
          <>
            <ProfileCarousel userPhotos={userPhotos} />
            <View style={profileStyles.container}>

              <ProfileHeader userProfile={userProfile} />

              <AppButton
                onPress={() => setToggleEdit(false)}
                btnColor='white'
                text='EDIT PROFILE'
              />

              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <FontAwesome size={16} name='user' />
                <Text style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                  {userProfile?.biography}
                </Text>
              </View>

              {/* BUCKETLIST */}
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
              {/* BUCKETLIST */}

              <Badges iconName='comment' title='Languages' items={['English', 'French', 'Spanish']} />

              <Badges iconName='map-marker' title='Location' items={['Live in Doha', 'From Mexico']} />
            </View>
          </>
        )}

        {!toggleEdit && (
          <>
            <AppPhotosGrid
              height={Dimensions.get('window').height * 0.25}
              photosList={userPhotos}
              onHandlePickImage={handlePickMultipleImages}
              onDeleteImage={handleDeleteImage}
              placeholders={selectionLimit}
            />
            <View style={profileStyles.container}>
              <Formik
                enableReinitialize
                validationSchema={validationSchemma}
                initialValues={{
                  biography: userProfile?.biography || '',
                  occupation: userProfile?.occupation || 'Software Engineer',
                  location: '',
                  homeTown: ''
                }}
                onSubmit={handleSumitUserInfo}
              >
                {({ handleBlur, handleChange, handleSubmit, values, touched, errors, setFieldValue }) => (
                  <View style={profileStyles.porfileContent}>
                    <AppButton
                      onPress={() => {
                        // handleSubmit();
                        setToggleEdit(true);
                      }}
                      btnColor='blue'
                      text='SAVE PROFILE'
                    />

                    <View style={{ gap: 8 }}>
                      <View style={{ gap: -4 }}>
                        <Text style={profileStyles.title}>Occupation</Text>
                        <Text style={{ color: gray_300 }}>Write your usual or principal job or profession </Text>
                      </View>

                      <View style={{ position: 'relative', justifyContent: 'center' }}>
                        {touched.occupation && errors.occupation && (
                          <AppLabelFeedbackMsg position='bottom' text={errors.occupation} />
                        )}
                        <AppTextInput
                          iconName='briefcase'
                          keyboardType="ascii-capable"
                          onChangeText={handleChange('occupation')}
                          onBlur={handleBlur('occupation')}
                          value={values.occupation}
                        />
                      </View>
                    </View>

                    <View style={{ gap: 8 }}>
                      <View style={{ gap: -4 }}>
                        <Text style={profileStyles.title}>Bio</Text>
                        <Text style={{ color: gray_300 }}>Something fun about yourself and who you are </Text>
                      </View>

                      <View style={{ position: 'relative' }}>
                        {touched.biography && errors.biography && (
                          <AppLabelFeedbackMsg position='bottom' text={errors.biography} />
                        )}
                        <AppTextInput
                          iconName='user'
                          keyboardType="ascii-capable"
                          onChangeText={handleChange('biography')}
                          onBlur={handleBlur('biography')}
                          value={values.biography}
                        />
                      </View>
                    </View>

                    <View style={{ gap: 8 }}>
                      <View style={{ gap: -4 }}>
                        <Text style={profileStyles.title}>Languages</Text>
                        <Text style={{ color: gray_300 }}>How many languages you speak</Text>
                      </View>

                      <View style={profileStyles.wrapper}>
                        <AppButton btnColor='white' text='English' style={badgesStyles.badge} />
                        <AppButton btnColor='white' text='Spanish' style={badgesStyles.badge} />
                        <AppButton btnColor='white' text='French' style={badgesStyles.badge} />

                        <BaseButton style={{ borderRadius: 50, padding: 4, position: 'absolute', right: 20 }}>
                          <FontAwesome name='chevron-right' size={18} />
                        </BaseButton>
                      </View>
                    </View>

                    <View style={{ gap: 8 }}>
                      <View style={{ gap: -4 }}>
                        <Text style={profileStyles.title}>Location</Text>
                        <Text style={{ color: gray_300 }}>Where you are currently</Text>
                      </View>

                      <View style={profileStyles.wrapper}>
                        <AppButton
                          onPress={() => router.push('/editProfile/homeTown')}
                          btnColor='white' text='Select' style={badgesStyles.badge}
                        />
                        <BaseButton style={{ borderRadius: 50, padding: 4, position: 'absolute', right: 20 }}>
                          <FontAwesome name='chevron-right' size={18} />
                        </BaseButton>
                      </View>
                    </View>

                    <View style={{ gap: 8 }}>
                      <View style={{ gap: -4 }}>
                        <Text style={profileStyles.title}>Home city</Text>
                        <Text style={{ color: gray_300 }}>Where you come from</Text>
                      </View>

                      <View style={profileStyles.wrapper}>
                        <AppButton
                          onPress={() => router.push('/editProfile/homeTown')}
                          btnColor='white' text='Select' style={badgesStyles.badge}
                        />

                        <BaseButton style={{ borderRadius: 50, padding: 4, position: 'absolute', right: 20 }}>
                          <FontAwesome name='chevron-right' size={18} />
                        </BaseButton>
                      </View>
                    </View>
                  </View>
                )}
              </Formik>
            </View>
          </>
        )}

        {/* <Button onPress={() => handleLogout()} title='log out' /> */}
      </ScrollView>
    </SafeAreaView>
  );
}
