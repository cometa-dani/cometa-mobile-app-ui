import { FC, useEffect, useState } from 'react';
import { useStyles } from 'react-native-unistyles';
import { FieldText } from '@/components/input/textField';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useCometaStore } from '@/store/cometaStore';
import { ICreateUser, IGetDetailedUserProfile, IUpdateUser, IUserOnboarding } from '@/models/User';
import {
  useMutationCreateUser,
  useMutationUpdateUserById,
  useMutationUploadUserPhotos
} from '@/queries/currentUser/userHooks';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { FooterButton } from './components/footerButton';
import { IProps } from './components/interface';
import { useRouter } from 'expo-router';
import { ICityKind, useSelectCityByName } from '@/components/modal/searchCity/hook';
import { useSelectLanguages } from '@/components/modal/selectLanguages/hook';
import { supabase } from '@/supabase/config';
import { Notifier } from 'react-native-notifier';
import { ErrorToast, InfoToast, SucessToast } from '@/components/toastNotification/toastNotification';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/queries/queryKeys';
import userService from '@/services/userService';
import { AuthError } from '@supabase/supabase-js';
import { AxiosError } from 'axios';


export const errorMessages = {
  occupation: 'Write your usual or principal job or profession',
  biography: 'Something fun about yourself',
  currentLocation: 'Where you are currently',
  homeTown: 'Where you come from',
  languages: 'How many languages do you speak',
};

export interface IFormValues extends Partial<Pick<IUserOnboarding, (
  'occupation' |
  'biography' |
  'currentLocation' |
  'homeTown'
)>> {
  languages?: string
}

export const validationSchema = Yup.object<IFormValues>().shape({
  occupation: Yup.string().max(120).optional(),
  biography: Yup.string().max(200).optional(),
  currentLocation: Yup.string().max(120).optional(),
  homeTown: Yup.string().max(120).optional(),
  languages: Yup.string().optional(),
});

export const defaultValues: IFormValues = {
  occupation: '',
  biography: '',
  currentLocation: '',
  homeTown: '',
  languages: '',
};

export const AboutYourSelfForm: FC<IProps> = ({ onNext }) => {
  const router = useRouter();
  const { theme } = useStyles();
  const formProps = useForm<IFormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });
  const onboardingUser = useCometaStore(state => state.onboarding.user);
  const setIsAuthenticated = useCometaStore(state => state.setIsAuthenticated);
  const clearOnboarding = useCometaStore(state => state.clearOnboarding);
  const { selectedCity, cityKind, setCityKind } = useSelectCityByName();
  const { selectedLanguages } = useSelectLanguages();
  const createUser = useMutationCreateUser();
  const updateUser = useMutationUpdateUserById();
  const uploadPhotos = useMutationUploadUserPhotos();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleUserCreation = async (values: IFormValues): Promise<void> => {
    setIsLoading(true);
    const updateUserPayload: IUpdateUser = {
      biography: values.biography,
      currentLocation: values.currentLocation,
      homeTown: values.homeTown,
      languages: values.languages,
      occupation: values.occupation
    };
    Notifier.showNotification({
      duration: 0,
      title: 'Creating your profile',
      description: 'your profile is being created',
      Component: InfoToast,
    });
    try {
      const { data, error } = await supabase.auth.signUp({ email: onboardingUser.email, password: onboardingUser.password });
      if (error) throw error;
      const createUserPayload: ICreateUser = {
        email: onboardingUser.email,
        name: onboardingUser.name,
        username: onboardingUser.username,
        uid: data?.user?.id ?? '', // from supabase
        birthday: onboardingUser.birthday,
      };
      const newUser = await createUser.mutateAsync(createUserPayload);
      await uploadPhotos.mutateAsync({ userId: newUser.id, pickedImgFiles: onboardingUser.photos });
      await updateUser.mutateAsync({ userId: newUser.id, payload: updateUserPayload });
      await queryClient.prefetchQuery({
        queryKey: [QueryKeys.GET_LOGGED_IN_USER_PROFILE],
        queryFn: async (): Promise<IGetDetailedUserProfile> => {
          const res = await userService.getUserProfileWithLikedEvents(data?.user?.id as string);
          if (res.status === 200) {
            setIsAuthenticated(true);
            return res.data;
          }
          else {
            throw new Error('failed to fetched');
          }
        }
      });
      Notifier.hideNotification();
      Notifier.showNotification({
        title: 'Welcome to cometa',
        description: 'Congrats, your profile was created successfully',
        Component: SucessToast,
      });
      onNext();
      router.replace('/(userTabs)/');
      clearOnboarding();
    }
    catch (error) {
      let errorMessage = 'try again';
      if (error instanceof AxiosError) {
        errorMessage = error?.message;
      }
      if (error instanceof AuthError) {
        errorMessage = error?.message;
      }
      Notifier.hideNotification();
      Notifier.showNotification({
        title: 'Error',
        description: `something went wrong: ${errorMessage}`,
        Component: ErrorToast,
      });
    }
    finally {
      setIsLoading(false);
    }
  };

  const navigateToSelectCity = (kind: keyof ICityKind) => {
    setCityKind(kind);
    router.push('/(userStacks)/selectCity');
  };

  const navigateToSelectLanguages = () => {
    router.push('/(userStacks)/selectLanguages');
  };

  // update form values homeTown and currentLocation
  useEffect(() => {
    if (!Object.values(selectedCity).length) return;
    formProps.setValue(cityKind, selectedCity[cityKind]);
  }, [selectedCity]);

  // update form values languages
  useEffect(() => {
    if (!selectedLanguages.length) return;
    formProps.setValue('languages', selectedLanguages.join(', '));
  }, [selectedLanguages]);

  return (
    <>
      <FormProvider {...formProps}>
        <KeyboardAwareScrollView
          bottomOffset={theme.spacing.sp10}
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.sp10,
            paddingBottom: theme.spacing.sp12,
            gap: theme.spacing.sp7,
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
        </KeyboardAwareScrollView>

        <FooterButton
          isLoading={isLoading}
          text='Register'
          onNext={formProps.handleSubmit(handleUserCreation)}
        />
      </FormProvider>
    </>
  );
};
