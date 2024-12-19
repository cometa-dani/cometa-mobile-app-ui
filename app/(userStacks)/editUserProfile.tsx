import { ReactNode, } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Condition } from '@/components/utils/ifElse';
import { Center } from '@/components/utils/stacks';
import { useStyles } from 'react-native-unistyles';
import { useQueryClient } from '@tanstack/react-query';
import {
  useMutationUpdateUserById,
  useMutationUpdateUserPhoto,
  useMutationUploadUserPhotos,
  useQueryGetUserProfile
} from '@/queries/currentUser/userHooks';
import {
  IFormValues,
  defaultValues,
  validationSchema,
  errorMessages
} from '@/components/onboarding/user/steps/aboutYourSelf';
import { IPhotoPlaceholder } from '@/components/onboarding/user/photosGrid/photoGrid';
import { IPhoto } from '@/models/Photo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { FormProvider, useForm } from 'react-hook-form';
import { IUpdateUser } from '@/models/User';
import { yupResolver } from '@hookform/resolvers/yup';
import { ICityKind, useSelectCityByName } from '@/components/modal/searchCity/hook';
import { useSelectLanguages } from '@/components/modal/selectLanguages/hook';
import { FieldText } from '@/components/input/textField';
import { tabBarHeight } from '@/components/tabBar/tabBar';
import { Button } from '@/components/button/button';
import { PhotosGrid } from '@/components/onboarding/user/photosGrid/photoGrid';
import { Notifier } from 'react-native-notifier';
import { ErrorToast, InfoToast, SucessToast } from '@/components/toastNotification/toastNotification';
import { QueryKeys } from '@/queries/queryKeys';


export default function EditUserProfileScreen(): ReactNode {
  const { theme } = useStyles();
  const router = useRouter();
  const queryClient = useQueryClient();
  const updateUser = useMutationUpdateUserById();
  const updatePhoto = useMutationUpdateUserPhoto();
  const uploadPhoto = useMutationUploadUserPhotos();
  const { data: userProfile, isFetched } = useQueryGetUserProfile();
  const { selectedCity, setCityKind } = useSelectCityByName();
  const { selectedLanguages } = useSelectLanguages();
  const userPhotos: IPhoto[] = userProfile?.photos ?? [];
  const formProps = useForm<IFormValues>({
    defaultValues,                        // initial form values
    values: {                             // updates form values when data changes
      biography: userProfile?.biography || '',
      currentLocation: selectedCity.currentLocation || userProfile?.currentLocation || '',
      homeTown: selectedCity.homeTown || userProfile?.homeTown || '',
      languages: selectedLanguages.join(', ') || userProfile?.languages?.join(', ') || '',
      occupation: userProfile?.occupation || ''
    },
    resolver: yupResolver(validationSchema),
  });

  const handleUserUpdate = async (values: IFormValues): Promise<void> => {
    const updateUserPayload: IUpdateUser = {
      biography: values.biography,
      currentLocation: values.currentLocation,
      homeTown: values.homeTown,
      languages: values.languages,
      occupation: values.occupation
    };
    Notifier.showNotification({
      duration: 0,
      title: 'Saving...',
      description: 'your profile is being saved',
      Component: InfoToast,
    });
    try {
      if (!userProfile?.id) return;
      await updateUser.mutateAsync({ userId: userProfile?.id, payload: updateUserPayload });
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_LOGGED_IN_USER_PROFILE] });
      Notifier.hideNotification();
      Notifier.showNotification({
        title: 'Done',
        description: 'your profile was saved successfully',
        Component: SucessToast,
      });
    } catch (error) {
      Notifier.hideNotification();
      Notifier.showNotification({
        title: 'Error',
        description: 'something went wrong, try again',
        Component: ErrorToast,
      });
    }
  };

  const handlePhotoPickUp = async (photos: IPhotoPlaceholder[]) => {
    if (!userProfile?.id) return;
    Notifier.showNotification({
      duration: 0,
      title: 'Uploading...',
      description: 'photos are being uploaded',
      Component: InfoToast,
    });
    try {
      if (photos.length === 1 && photos[0].fromBackend && photos[0].fromFileSystem) {
        const payload = {
          pickedAsset: photos[0],
          userId: userProfile?.id,
          photoId: userPhotos[0].id
        };
        //  update/replace
        await updatePhoto.mutateAsync(payload);
      }
      else {
        // create
        await uploadPhoto.mutateAsync({ pickedImgFiles: photos, userId: userProfile?.id });
      }
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_LOGGED_IN_USER_PROFILE] });
      Notifier.hideNotification();
      Notifier.showNotification({
        duration: 5_000,
        title: 'Done',
        description: 'your profile was saved successfully',
        Component: SucessToast,
      });
    } catch (error) {
      Notifier.hideNotification();
      Notifier.showNotification({
        duration: 5_000,
        title: 'Error',
        description: 'something went wrong, try again',
        Component: ErrorToast,
      });
    }
  };

  const navigateToSelectCity = (kind: keyof ICityKind) => {
    setCityKind(kind);
    router.push('/(userStacks)/selectCity');
  };

  const navigateToSelectLanguages = () => {
    router.push('/(userStacks)/selectLanguages');
  };

  return (
    <FormProvider  {...formProps}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Edit Profile',
          headerTitleAlign: 'center',
        }}
      />
      <Condition
        if={isFetched}
        then={(
          <KeyboardAwareScrollView>
            <View style={{
              paddingBottom: theme.spacing.sp10,
              padding: theme.spacing.sp6
            }}>
              <PhotosGrid
                mode='update'
                initialPhotos={userPhotos}
                onSelect={handlePhotoPickUp}
              />
            </View>

            <View style={{
              gap: theme.spacing.sp7,
              backgroundColor: theme.colors.white100,
              paddingHorizontal: theme.spacing.sp8,
              paddingVertical: theme.spacing.sp11,
              borderRadius: theme.spacing.sp6
            }}>
              <FieldText
                label='Occupation'
                name='occupation'
                placeholder='Enter your Occupation'
                iconName='suitcase'
                defaultErrMessage={errorMessages.occupation}
              />
              <FieldText
                label='Bio'
                multiline={true}
                name='biography'
                placeholder='Enter your Biography'
                iconName='sticky-note-o'
                defaultErrMessage={errorMessages.biography}
              />
              <FieldText
                editable={false}
                label='Languages you know'
                name='languages'
                onShowSelector={() => navigateToSelectLanguages()}
                placeholder='Enter your Languages'
                iconName='language'
                defaultErrMessage={errorMessages.languages}
              />
              <FieldText
                editable={false}
                label='Location'
                name='currentLocation'
                onShowSelector={() => navigateToSelectCity('currentLocation')}
                placeholder='Enter your current Location'
                iconName='map-o'
                defaultErrMessage={errorMessages.currentLocation}
              />
              <FieldText
                editable={false}
                label='Home Town'
                name='homeTown'
                onShowSelector={() => navigateToSelectCity('homeTown')}
                placeholder='Enter your home Town'
                iconName='map-marker'
                defaultErrMessage={errorMessages.homeTown}
              />

              <Button
                variant='primary'
                showLoading={updateUser.isPending || updatePhoto.isPending || uploadPhoto.isPending}
                style={{ marginTop: theme.spacing.sp8 }}
                onPress={formProps.handleSubmit(handleUserUpdate)}
              >
                Done
              </Button>
              <View style={{ height: tabBarHeight }} />
            </View>
          </KeyboardAwareScrollView>
        )}
        else={(
          <Center styles={{ flex: 1 }}>
            <ActivityIndicator
              size="large"
              style={{ marginTop: -theme.spacing.sp8 }}
              color={theme.colors.red100}
            />
          </Center>
        )}
      />
    </FormProvider>
  );
}
