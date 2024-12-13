import React, { ReactNode, } from 'react';
import { SafeAreaView, View, ActivityIndicator } from 'react-native';
import { Stack, router, useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { defaultImgPlaceholder, MAX_NUMBER_PHOTOS } from '../../../../constants/vars';
import { TextView } from '@/components/text/text';
import { Condition } from '@/components/utils/ifElse';
import { Center } from '@/components/utils/stacks';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useQueryClient } from '@tanstack/react-query';
import { useMutationDeleteUserById, useMutationUpdateUserById, useMutationUploadUserPhotos, useQueryGetUserProfile } from '@/queries/currentUser/userHooks';
import { useInfiniteQueryGetBucketListScreen } from '@/queries/currentUser/eventHooks';
import { IPhoto } from '@/models/Photo';
import * as ImagePicker from 'expo-image-picker';
import { createEmptyPlaceholders, hasAsset, IPhotoPlaceholder, PhotosGrid } from '@/components/onboarding/user/photosGrid/photosGrid';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { FormProvider, useForm } from 'react-hook-form';
import { IUpdateUser, IUserOnboarding } from '@/models/User';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useCometaStore } from '@/store/cometaStore';
import { ICityKind, useSelectCityByName } from '@/components/modal/searchCity/hook';
import { useSelectLanguages } from '@/components/modal/selectLanguages/hook';
import { supabase } from '@/supabase/config';
import { FieldText } from '@/components/input/textField';
import { tabBarHeight } from '@/components/tabBar/tabBar';
import { FooterButton } from '@/components/onboarding/user/steps/components/footerButton';
import { Button } from '@/components/button/button';
import { PhotosGrid2 } from '@/components/onboarding/user/photosGrid/photoGrid2';


const setInitialPlaceholders = () => createEmptyPlaceholders(MAX_NUMBER_PHOTOS);

export const errorMessages = {
  occupation: 'Write your usual or principal job or profession',
  biography: 'Something fun about yourself',
  currentLocation: 'Where you are currently',
  homeTown: 'Where you come from',
  languages: 'How many languages do you speak',
};

interface IFormValues extends Partial<Pick<IUserOnboarding, (
  'occupation' |
  'biography' |
  'currentLocation' |
  'homeTown'
)>> {
  languages?: string
}

const validationSchema = Yup.object<IFormValues>().shape({
  occupation: Yup.string().max(120).optional(),
  biography: Yup.string().max(200).optional(),
  currentLocation: Yup.string().max(120).optional(),
  homeTown: Yup.string().max(120).optional(),
  languages: Yup.string().optional(),
});

const defaultValues: IFormValues = {
  occupation: '',
  biography: '',
  currentLocation: '',
  homeTown: '',
  languages: '',
};

export default function EditUserProfileScreen(): ReactNode {
  const { styles, theme } = useStyles(styleSheet);
  const queryClient = useQueryClient();
  const deleteUser = useMutationDeleteUserById();
  const updateUser = useMutationUpdateUserById();
  const router = useRouter();
  const { data: userBucketList } = useInfiniteQueryGetBucketListScreen();
  const { data: userProfile, isFetched } = useQueryGetUserProfile();
  // const mutateLoggedInUserProfileById = useMutationUpdateUserById();
  const formProps = useForm<IFormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });
  const userState = useCometaStore(state => state.onboarding.user);
  const { selectedCity, cityKind, setCityKind } = useSelectCityByName();
  const { selectedLanguages } = useSelectLanguages();
  const uploadPhotos = useMutationUploadUserPhotos();

  const handleUserCreation = async (values: IFormValues): Promise<void> => {
    const updateUserPayload: IUpdateUser = {
      biography: values.biography,
      currentLocation: values.currentLocation,
      homeTown: values.homeTown,
      languages: values.languages ? values.languages.split(',') : [],
      occupation: values.occupation
    };
    try {
      const { data, error } = await supabase.auth.signUp({ email: userState.email, password: userState.password });
      if (error) throw error;
      // const createUserPayload: ICreateUser = {
      //   email: userState.email,
      //   name: userState.name,
      //   username: userState.username,
      //   uid: data?.user?.id ?? '', // from supabase
      //   birthday: userState.birthday,
      // };
      // const newUser = await createUser.mutateAsync(createUserPayload);
      if (!userProfile?.id) return;
      await uploadPhotos.mutateAsync({ userId: userProfile?.id, pickedImgFiles: userState.photos });
      await updateUser.mutateAsync({ userId: userProfile?.id, payload: updateUserPayload });
      // await supabase.auth.setSession({
      //   access_token: data?.session?.access_token ?? '',
      //   refresh_token: data?.session?.refresh_token ?? ''
      // });
      // onNext();
    } catch (error) {
      return;
    }
  };

  const navigateToSelectCity = (kind: keyof ICityKind) => {
    setCityKind(kind);
    router.push('/(stacks)/selectCity');
  };

  const navigateToSelectLanguages = () => {
    router.push('/(stacks)/selectLanguages');
  };

  // queries
  const { data: loggedInUserBucketList } = useInfiniteQueryGetBucketListScreen();
  const userPhotos: IPhoto[] = userProfile?.photos ?? [];
  const remainingPhotosToUpload: number = MAX_NUMBER_PHOTOS - (userPhotos?.length || 0);


  const handleSumitLoggedInUserInfo =
    async (): Promise<void> => {
      // mutateLoggedInUserProfileById.mutate({ userId: loggedInuserProfile?.id as number, payload: values });
      // actions.setSubmitting(false);
    };

  const handlePickMultipleImages = async () => {
    if (remainingPhotosToUpload === 0) {
      return;
    }
    else {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsMultipleSelection: true,
          selectionLimit: remainingPhotosToUpload, // only allows to select a number below the limit
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.canceled && userProfile?.id) {
          const pickedImages = (result.assets).map((asset) => ({ url: asset.uri, }));

          // mutateLoggedInUserPhotosUpload.mutate({
          //   userId: loggedInuserProfile?.id,
          //   // pickedImgFiles: pickedImages
          // });
        }
      }
      catch (error) {
        // console.log(error);
      }
    }
  };

  const handleUserState = (photos: IPhotoPlaceholder[]) => {
    const filteredPhotos = photos.filter(hasAsset);
    // setOnboardingState({ photos: filteredPhotos });
  };

  const handleDeleteImage = async (photoUuid: string) => {
    deleteUser.mutate({ userID: userProfile?.id as number, photoUuid });
  };

  const navigateToUserProfile = (): void => {
    router.push(`/(stacks)/editUserProfile?userId=${userProfile?.id}`);
  };

  const handleLogout = (): void => {
    queryClient.clear();
    // signOut(auth);
  };

  return (
    <FormProvider {...formProps}>
      <Stack.Screen
        options={{
          animation: 'default',
          gestureDirection: 'horizontal',
          fullScreenGestureEnabled: true,
          headerTitle: 'Edit Profile',
          headerTitleAlign: 'center'
        }}
      />
      <Condition
        if={isFetched}
        then={(
          <KeyboardAwareScrollView
            contentContainerStyle={{
              padding: theme.spacing.sp6,
              gap: theme.spacing.sp7,
            }}
          >
            <View style={{ paddingBottom: theme.spacing.sp2 }}>
              <PhotosGrid2
                action='update'
                setInitialPhotos={setInitialPlaceholders}
                onSelect={handleUserState}
              />
            </View>

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
              onPress={formProps.handleSubmit(handleUserCreation)}
            >
              Done
            </Button>
            <View style={{ height: tabBarHeight * 1 }} />
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


const styleSheet = createStyleSheet((theme) => ({
  eventItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    height: 64,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%'
  }
}));
