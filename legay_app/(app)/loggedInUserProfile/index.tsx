import { ScrollView, SafeAreaView, Dimensions, View as TransparentView } from 'react-native';
import { Text, View, useColors } from '../../../legacy_components/Themed';
import { signOut } from 'firebase/auth';
import { auth } from '../../../config/firebase/firebase';
import { useCometaStore } from '../../../store/cometaStore';
import { useMutationDeleteUserById, useMutationUploadUserPhotos, useMutationUpdateUserById, useQueryGetUserProfile } from '../../../queries/currentUser/userHooks';
import { AppButton } from '../../../legacy_components/buttons/buttons';
import { FC, useEffect, useRef, useState } from 'react';
import { Stack, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { AppCarousel } from '../../../legacy_components/carousels/carousel';
import { profileStyles } from '../../../legacy_components/profile/profileStyles';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';
import { Badges, badgesStyles } from '../../../legacy_components/profile/badges';
import { ProfileCarousel } from '../../../legacy_components/profile/profileCarousel';
import { ProfileTitle } from '../../../legacy_components/profile/profileTitle';
import { AppPhotosGrid } from '../../../legacy_components/profile/photosGrid';
import { FontAwesome } from '@expo/vector-icons';
import { AppLabelFeedbackMsg, AppTextInput } from '../../../legacy_components/textInput/AppTextInput';
import { gray_300 } from '../../../constants/colors';
import { BaseButton } from 'react-native-gesture-handler';
import { IPhoto } from '../../../models/Photo';
import { IGetBasicUserProfile } from '../../../models/User';
import { ForEach, If, ON, OFF } from '../../../legacy_components/utils';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { useInfiniteQueryGetCurrUserLikedEvents } from '../../../queries/currentUser/eventHooks';
import { maximunNumberOfPhotos } from '../../../constants/vars';
import uuid from 'react-native-uuid';


type userAttributes = keyof IGetBasicUserProfile

type ProfileValues = {
  occupation: string,
  biography: string,
}


const validationSchemma = Yup.object<ProfileValues>({
  occupation: Yup.string().min(5).max(32).required(),
  biography: Yup.string().min(5).max(120).required(),
});


export default function LoggedInUserProfileScreen(): JSX.Element {
  const scrollViewRef = useRef<ScrollView>(null);
  const queryClient = useQueryClient();
  const { background } = useColors();
  const loggedInUserUuid = useCometaStore(state => state.uid); // this can be abstracted

  // mutations
  const mutateLoggedInUserPhotosUpload = useMutationUploadUserPhotos(loggedInUserUuid);
  const mutateLoggedInUserPhotosDelete = useMutationDeleteUserById(loggedInUserUuid);
  const mutateLoggedInUserProfileById = useMutationUpdateUserById();

  // queries
  const { data: loggedInUserBucketList } = useInfiniteQueryGetCurrUserLikedEvents();
  const { data: loggedInuserProfile, isLoading } = useQueryGetUserProfile(loggedInUserUuid);
  const userPhotos: IPhoto[] = loggedInuserProfile?.photos ?? [];
  const remainingPhotosToUpload: number = maximunNumberOfPhotos - (userPhotos?.length || 0);

  // toggle edit mode
  const [switchEditionModeForLoggedInUser, setSwitchEditionModeForLoggedInUser] = useState(ON);

  // bucketlist
  const bucketlistLikedEvents =
    loggedInUserBucketList?.pages.
      flatMap(({ items: events }) => (
        events.map(
          event => ({
            id: event?.photos[0]?.id,
            img: event?.photos[0]?.url,
            placeholder: event?.photos[0]?.placeholder
          })
        )
      )) || [];


  const handleSumitLoggedInUserInfo =
    async (values: ProfileValues, actions: FormikHelpers<ProfileValues>): Promise<void> => {
      mutateLoggedInUserProfileById.mutate({ userId: loggedInuserProfile?.id as number, payload: values });
      actions.setSubmitting(false);
    };


  const handlePickMultipleImages = async () => {
    if (remainingPhotosToUpload === 0) {
      return;
    }
    else {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          selectionLimit: remainingPhotosToUpload, // only allows to select a number below the limit
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.canceled && loggedInuserProfile?.id) {
          const pickedImages = (result.assets).map((asset) => ({ url: asset.uri, uuid: uuid.v4().toString() }));

          mutateLoggedInUserPhotosUpload.mutate({
            userId: loggedInuserProfile?.id,
            pickedImgFiles: pickedImages
          });
        }
      }
      catch (error) {
        // console.log(error);
      }
    }
  };


  const handleDeleteImage = async (photoUuid: string) => {
    mutateLoggedInUserPhotosDelete.mutate({ userID: loggedInuserProfile?.id as number, photoUuid });
  };


  const navigateToEditLoggedInUserProfilePushedScreen = (field: userAttributes): void => {
    router.push(`/editUserProfile/${field}?userId=${loggedInuserProfile?.id}`);
  };


  const handleLogout = (): void => {
    queryClient.clear();
    queryClient.removeQueries();
    queryClient.cancelQueries();
    signOut(auth);
  };


  const LoggedInUserProfile: FC = () => (
    <>
      <ProfileCarousel
        isLoading={isLoading}
        userPhotos={userPhotos}
      />

      <View style={profileStyles.container}>

        <ProfileTitle
          isLoading={isLoading}
          userProfile={loggedInuserProfile}
        />

        <AppButton
          onPress={() => setSwitchEditionModeForLoggedInUser(OFF)}
          btnColor='white'
          text='EDIT PROFILE'
        />

        <If
          condition={!isLoading}
          elseRender={(
            <ContentLoader
              speed={1}
              width={150}
              height={12}
              viewBox={`0 0 ${150} ${12}`}
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
            >
              <Rect x="6" y="0" rx="6" ry="6" width="140" height="12" />
            </ContentLoader>
          )}
          render={(
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <FontAwesome size={20} name='user' style={{ alignSelf: 'flex-start' }} />
              <Text size='md' style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingRight: 20 }}>
                {loggedInuserProfile?.biography}
              </Text>
            </View>
          )}
        />

        <AppCarousel
          list={bucketlistLikedEvents}
          title='Bucket list'
        />

        <If condition={loggedInuserProfile?.languages?.length}
          render={(
            <Badges
              iconName='comment'
              title='Languages'
              items={loggedInuserProfile?.languages ?? []}
            />
          )}
        />

        <If condition={loggedInuserProfile?.homeTown && loggedInuserProfile?.currentLocation}
          render={(
            <Badges
              iconName='map-marker'
              title='Location'
              items={[`from ${loggedInuserProfile?.homeTown}`, `live in ${loggedInuserProfile?.currentLocation}`]}
            />
          )}
        />

        <View style={{ paddingVertical: 20 }}>
          <AppButton btnColor='black' onPress={() => handleLogout()} text='LOG OUT' />
        </View>
      </View>
    </>
  );


  const EditLoggedInUserProfile: FC = () => (
    <>
      <AppPhotosGrid
        height={Dimensions.get('window').height * 0.25}
        photosList={userPhotos}
        onHandlePickImage={handlePickMultipleImages}
        onDeleteImage={handleDeleteImage}
        placeholders={remainingPhotosToUpload}
      />
      <View style={profileStyles.container}>
        <Formik
          enableReinitialize
          validationSchema={validationSchemma}
          initialValues={{
            biography: loggedInuserProfile?.biography ?? '',
            occupation: loggedInuserProfile?.occupation ?? '',
          }}
          onSubmit={handleSumitLoggedInUserInfo}
        >
          {({ handleBlur, handleChange, handleSubmit, values, touched, errors, dirty }) => (
            <View style={profileStyles.porfileContent}>


              {/* occupation */}
              <View style={{ gap: 8 }}>
                <View style={{ gap: -4 }}>
                  <Text size='lg'>Occupation</Text>
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
                  <Text size='lg'>Bio</Text>
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
                  <Text size='lg'>Languages</Text>
                  <Text style={{ color: gray_300 }}>How many languages you speak</Text>
                </View>

                <AppButton
                  btnColor='white'
                  onPress={() => navigateToEditLoggedInUserProfilePushedScreen('languages')}
                  style={profileStyles.wrapper}
                >
                  <If
                    condition={loggedInuserProfile?.languages?.length}
                    elseRender={(
                      <AppButton
                        btnColor='white' text='Add' style={badgesStyles.badge}
                      />
                    )}
                    render={(
                      <TransparentView style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, width: '80%' }}>
                        <ForEach items={loggedInuserProfile?.languages ?? []}>
                          {(language, index) => (
                            <AppButton
                              key={index}
                              btnColor='white'
                              text={language}
                              style={badgesStyles.badge}
                            />
                          )}
                        </ForEach>
                      </TransparentView>
                    )}
                  />

                  <TransparentView
                    style={{ borderRadius: 50, padding: 4, position: 'absolute', right: 20 }}>
                    <FontAwesome name='chevron-right' size={18} />
                  </TransparentView>
                </AppButton>
              </View>
              {/* languages */}


              {/* current location */}
              <View style={{ gap: 8 }}>
                <View style={{ gap: -4 }}>
                  <Text size='lg'>Location</Text>
                  <Text style={{ color: gray_300 }}>Where you are currently</Text>
                </View>

                <AppButton
                  btnColor='white'
                  onPress={() => navigateToEditLoggedInUserProfilePushedScreen('currentLocation')}
                  style={profileStyles.wrapper}
                >
                  <If
                    condition={loggedInuserProfile?.currentLocation}
                    render={(
                      <AppButton
                        btnColor='white' text={loggedInuserProfile?.currentLocation} style={badgesStyles.badge}
                      />
                    )}
                    elseRender={(
                      <AppButton
                        // onPress={() => navigateToEditLoggedInUserProfilePushedScreen('currentLocation')}
                        btnColor='white' text='Add' style={badgesStyles.badge}
                      />
                    )}
                  />

                  <BaseButton
                    // onPress={() => navigateToEditLoggedInUserProfilePushedScreen('currentLocation')}
                    style={{ borderRadius: 50, padding: 4, position: 'absolute', right: 20 }}>
                    <FontAwesome name='chevron-right' size={18} />
                  </BaseButton>
                </AppButton>
              </View>
              {/* current location */}


              {/* hometown */}
              <View style={{ gap: 8 }}>
                <View style={{ gap: -4 }}>
                  <Text size='lg'>Home city</Text>
                  <Text style={{ color: gray_300 }}>Where you come from</Text>
                </View>

                <AppButton
                  onPress={() => navigateToEditLoggedInUserProfilePushedScreen('homeTown')}
                  btnColor='white'
                  style={profileStyles.wrapper}>
                  <If
                    condition={loggedInuserProfile?.homeTown}
                    render={(
                      <AppButton
                        btnColor='white' text={loggedInuserProfile?.homeTown} style={badgesStyles.badge}
                      />
                    )}
                    elseRender={(
                      <AppButton
                        btnColor='white' text='Add' style={badgesStyles.badge}
                      />
                    )}
                  />

                  <BaseButton
                    style={{ borderRadius: 50, padding: 4, position: 'absolute', right: 20 }}>
                    <FontAwesome name='chevron-right' size={18} />
                  </BaseButton>
                </AppButton>
              </View>
              {/* hometown */}

              <AppButton
                style={{ marginVertical: 20 }}
                onPress={() => {
                  dirty && handleSubmit();
                  setSwitchEditionModeForLoggedInUser(ON);
                }}
                btnColor='blue'
                text='SAVE PROFILE'
              />
            </View>
          )}
        </Formik>
      </View>
    </>
  );


  useEffect(() => {
    if (switchEditionModeForLoggedInUser) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [switchEditionModeForLoggedInUser]);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: loggedInuserProfile?.username || '',
          headerTitleAlign: 'center'
        }}
      />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={true}
        style={{ backgroundColor: background }}
      >

        <If
          condition={switchEditionModeForLoggedInUser}
          render={(
            <LoggedInUserProfile />
          )}
          elseRender={(
            <EditLoggedInUserProfile />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
