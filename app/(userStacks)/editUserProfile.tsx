import { ReactNode, } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MAX_NUMBER_PHOTOS } from '../../constants/vars';
import { Condition } from '@/components/utils/ifElse';
import { Center } from '@/components/utils/stacks';
import { useStyles } from 'react-native-unistyles';
import { useQueryClient } from '@tanstack/react-query';
import {
  useMutationDeleteUserPhotoById,
  useMutationUpdateUserById,
  useMutationUploadUserPhotos,
  useQueryGetUserProfile
} from '@/queries/currentUser/userHooks';
import {
  IFormValues,
  defaultValues,
  validationSchema,
  errorMessages
} from '@/components/onboarding/user/steps/aboutYourSelf';
import {
  createEmptyPlaceholders,
  hasAsset,
  IPhotoPlaceholder
} from '@/components/onboarding/user/photosGrid/photoGrid2';
import { IPhoto } from '@/models/Photo';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { FormProvider, useForm } from 'react-hook-form';
import { IUpdateUser } from '@/models/User';
import { yupResolver } from '@hookform/resolvers/yup';
import { ICityKind, useSelectCityByName } from '@/components/modal/searchCity/hook';
import { useSelectLanguages } from '@/components/modal/selectLanguages/hook';
import { FieldText } from '@/components/input/textField';
import { tabBarHeight } from '@/components/tabBar/tabBar';
import { Button } from '@/components/button/button';
import { PhotosGrid2 } from '@/components/onboarding/user/photosGrid/photoGrid2';
import { Notifier } from 'react-native-notifier';
import { ErrorToast, SucessToast } from '@/components/toastNotification/toastNotification';


const setInitialPlaceholders = () => createEmptyPlaceholders(MAX_NUMBER_PHOTOS);


export default function EditUserProfileScreen(): ReactNode {
  const { theme } = useStyles();
  const router = useRouter();
  const queryClient = useQueryClient();
  const deletePhoto = useMutationDeleteUserPhotoById();
  const updateUser = useMutationUpdateUserById();
  const uploadPhoto = useMutationUploadUserPhotos();
  const { data: userProfile, isFetched } = useQueryGetUserProfile();
  const { selectedCity, setCityKind } = useSelectCityByName();
  const { selectedLanguages } = useSelectLanguages();
  const userPhotos: IPhoto[] = userProfile?.photos ?? [];
  const formProps = useForm<IFormValues>({
    defaultValues,                        // initial form values
    values: {                             // updates form values when data changes
      biography: userProfile?.biography ?? '',
      currentLocation: selectedCity.currentLocation ?? userProfile?.currentLocation ?? '',
      homeTown: selectedCity.homeTown ?? userProfile?.homeTown ?? '',
      languages: selectedLanguages.join(',') ?? userProfile?.languages?.join(',') ?? '',
      occupation: userProfile?.occupation ?? ''
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
    try {
      if (!userProfile?.id) return;
      await updateUser.mutateAsync({ userId: userProfile?.id, payload: updateUserPayload });
      Notifier.showNotification({
        title: 'Done',
        description: 'your profile was saved successfully',
        Component: SucessToast,
      });
    } catch (error) {
      Notifier.showNotification({
        title: 'Error',
        description: 'your profile was not saved successfully',
        Component: ErrorToast,
      });
      return;
    }
  };

  const handlePhotosPickUp = async (photos: IPhotoPlaceholder[]) => {
    const filteredPhotos = photos.filter(hasAsset);
    //   deleteUser.mutate({ userID: userProfile?.id as number, photoUuid });
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
              <PhotosGrid2
                action='update'
                setInitialPhotos={setInitialPlaceholders}
                onSelect={handlePhotosPickUp}
              />
            </View>

            <View style={{
              gap: theme.spacing.sp7,
              backgroundColor: theme.colors.white100,
              paddingHorizontal: theme.spacing.sp6,
              paddingVertical: theme.spacing.sp10,
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
