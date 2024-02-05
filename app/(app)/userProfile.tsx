import { ScrollView, SafeAreaView, Dimensions, Button } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useCometaStore } from '../../store/cometaStore';
import { useMutationDeleteUserPhotoByUuid, useMutationUploadUserPhotos, useMutationUserProfileById, useQueryGetUserProfileByUid } from '../../queries/userHooks';
import { AppButton } from '../../components/buttons/buttons';
import { FC, useState } from 'react';
import { Stack, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { AppCarousel } from '../../components/carousels/carousel';
import { profileStyles } from '../../components/profile/profileStyles';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';
import { Badges, badgesStyles } from '../../components/profile/badges';
import { ProfileCarousel } from '../../components/profile/profileCarousel';
import { ProfileHeader } from '../../components/profile/profileHeader';
import { AppPhotosGrid } from '../../components/profile/photosGrid';
import { FontAwesome } from '@expo/vector-icons';
import { AppLabelFeedbackMsg, AppTextInput } from '../../components/textInput/AppTextInput';
import { gray_300 } from '../../constants/colors';
import { BaseButton } from 'react-native-gesture-handler';
import { If } from '../../components/utils/ifElse';
import { Photo } from '../../models/Photo';
import { GetBasicUserProfile } from '../../models/User';
import { ForEach } from '../../components/utils/ForEach';


type userAttributes = keyof GetBasicUserProfile

type ProfileValues = {
  occupation: string,
  biography: string,
}

const validationSchemma = Yup.object<ProfileValues>({
  occupation: Yup.string().min(5).max(32).required(),
  biography: Yup.string().min(5).max(120).required(),
});


export default function UserProfileScreen(): JSX.Element {

  const queryClient = useQueryClient();
  const { background } = useColors();
  const uid = useCometaStore(state => state.uid); // this can be abstracted

  // mutations
  const mutateUserPhotosUpload = useMutationUploadUserPhotos(uid);
  const mutateUserPhotosDelete = useMutationDeleteUserPhotoByUuid(uid);
  const mutateUserProfileById = useMutationUserProfileById();

  // queries
  const { data: userProfile } = useQueryGetUserProfileByUid(uid);
  const userPhotos: Photo[] = userProfile?.photos ?? [];
  const selectionLimit: number = (userProfile?.maxNumPhotos || 5) - (userPhotos?.length || 0);

  // toggle edit mode
  const [toggleEdit, setToggleEdit] = useState(true);

  // bucketlist
  const bucketlistLikedEvents = userProfile
    ?.likedEvents
    .map(
      (item) => ({
        id: item.event.photos[0].id,
        img: item.event.photos[0].url,
        placeholder: item.event.photos[0].placeholder
      })
    )
    || [];


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


  const navigateToEditProfilePushedScreen = (field: userAttributes): void => {
    router.push(`/editProfile/${field}`);
  };


  const handleLogout = (): void => {
    queryClient.clear();
    queryClient.removeQueries();
    queryClient.cancelQueries();
    signOut(auth);
  };


  const Profile: FC = () => (
    <>
      <ProfileCarousel userPhotos={userPhotos} />
      <View style={profileStyles.container}>

        <ProfileHeader userProfile={userProfile} />

        <AppButton
          onPress={() => setToggleEdit(false)}
          btnColor='white'
          text='EDIT PROFILE'
        />

        <If
          condition={userProfile?.biography}
          render={(
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <FontAwesome size={16} name='user' />
              <Text style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                {userProfile?.biography}
              </Text>
            </View>
          )}
        />

        <AppCarousel
          list={bucketlistLikedEvents}
          title='BucketList'
        />

        <If condition={userProfile?.languages?.length}
          render={(
            <Badges
              iconName='comment'
              title='Languages'
              items={userProfile?.languages ?? []}
            />
          )}
        />

        <If condition={userProfile?.homeTown && userProfile?.currentLocation}
          render={(
            <Badges
              iconName='map-marker'
              title='Location'
              items={[userProfile?.homeTown, userProfile?.currentLocation]}
            />
          )}
        />
      </View>
    </>
  );


  const EditProfile: FC = () => (
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
            biography: userProfile?.biography ?? '',
            occupation: userProfile?.occupation ?? '',
          }}
          onSubmit={handleSumitUserInfo}
        >
          {({ handleBlur, handleChange, handleSubmit, values, touched, errors }) => (
            <View style={profileStyles.porfileContent}>
              <AppButton
                onPress={() => {
                  handleSubmit();
                  setToggleEdit(true);
                }}
                btnColor='blue'
                text='SAVE PROFILE'
              />

              {/* occupation */}
              <View style={{ gap: 8 }}>
                <View style={{ gap: -4 }}>
                  <Text style={profileStyles.title}>Occupation</Text>
                  <Text style={{ color: gray_300 }}>Write your usual or principal job or profession </Text>
                </View>

                <View style={{ position: 'relative', justifyContent: 'center' }}>
                  <If
                    condition={touched.occupation && errors.occupation}
                    render={(
                      <AppLabelFeedbackMsg position='bottom' text={errors.occupation} />
                    )}
                  />
                  <AppTextInput
                    iconName='briefcase'
                    keyboardType="ascii-capable"
                    onChangeText={handleChange('occupation')}
                    onBlur={handleBlur('occupation')}
                    value={values.occupation}
                  />
                </View>
              </View>
              {/* occupation */}


              {/* bio */}
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
              {/* bio */}


              {/* languages */}
              <View style={{ gap: 8 }}>
                <View style={{ gap: -4 }}>
                  <Text style={profileStyles.title}>Languages</Text>
                  <Text style={{ color: gray_300 }}>How many languages you speak</Text>
                </View>

                <View style={profileStyles.wrapper}>
                  <If
                    condition={userProfile?.languages?.length}
                    elseRender={(
                      <AppButton
                        onPress={() => navigateToEditProfilePushedScreen('languages')}
                        btnColor='white' text='Add' style={badgesStyles.badge}
                      />
                    )}
                    render={(
                      <ForEach items={userProfile?.languages ?? []}>
                        {(language, index) => (
                          <AppButton
                            key={index}
                            btnColor='white'
                            text={language}
                            style={badgesStyles.badge}
                          />
                        )}
                      </ForEach>
                    )}
                  />

                  <BaseButton
                    onPress={() => navigateToEditProfilePushedScreen('languages')}
                    style={{ borderRadius: 50, padding: 4, position: 'absolute', right: 20 }}>
                    <FontAwesome name='chevron-right' size={18} />
                  </BaseButton>
                </View>
              </View>
              {/* languages */}


              {/* current location */}
              <View style={{ gap: 8 }}>
                <View style={{ gap: -4 }}>
                  <Text style={profileStyles.title}>Location</Text>
                  <Text style={{ color: gray_300 }}>Where you are currently</Text>
                </View>

                <View style={profileStyles.wrapper}>
                  <If
                    condition={userProfile?.currentLocation}
                    render={(
                      <AppButton
                        onPress={() => navigateToEditProfilePushedScreen('currentLocation')}
                        btnColor='white' text={userProfile?.currentLocation} style={badgesStyles.badge}
                      />
                    )}
                    elseRender={(
                      <AppButton
                        onPress={() => navigateToEditProfilePushedScreen('currentLocation')}
                        btnColor='white' text='Add' style={badgesStyles.badge}
                      />
                    )}
                  />

                  <BaseButton
                    onPress={() => navigateToEditProfilePushedScreen('currentLocation')}
                    style={{ borderRadius: 50, padding: 4, position: 'absolute', right: 20 }}>
                    <FontAwesome name='chevron-right' size={18} />
                  </BaseButton>
                </View>
              </View>
              {/* current location */}


              {/* hometown */}
              <View style={{ gap: 8 }}>
                <View style={{ gap: -4 }}>
                  <Text style={profileStyles.title}>Home city</Text>
                  <Text style={{ color: gray_300 }}>Where you come from</Text>
                </View>

                <View style={profileStyles.wrapper}>
                  <If
                    condition={userProfile?.homeTown}
                    render={(
                      <AppButton
                        onPress={() => navigateToEditProfilePushedScreen('homeTown')}
                        btnColor='white' text={userProfile?.homeTown} style={badgesStyles.badge}
                      />
                    )}
                    elseRender={(
                      <AppButton
                        onPress={() => navigateToEditProfilePushedScreen('homeTown')}
                        btnColor='white' text='Add' style={badgesStyles.badge}
                      />
                    )}
                  />

                  <BaseButton
                    onPress={() => navigateToEditProfilePushedScreen('homeTown')}
                    style={{ borderRadius: 50, padding: 4, position: 'absolute', right: 20 }}>
                    <FontAwesome name='chevron-right' size={18} />
                  </BaseButton>
                </View>
              </View>
              {/* hometown */}
            </View>
          )}
        </Formik>
      </View>
    </>
  );


  return (
    <SafeAreaView style={{ flex: 1 }}>

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
        <If
          condition={toggleEdit}
          render={<Profile />}
          elseRender={<EditProfile />}
        />
        <View style={{ padding: 20 }}>
          <Button onPress={() => handleLogout()} title='log out' />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
