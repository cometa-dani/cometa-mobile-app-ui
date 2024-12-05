import { FC, useEffect } from 'react';
import { useStyles } from 'react-native-unistyles';
import { FieldText } from '@/components/input/textField';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useCometaStore } from '@/store/cometaStore';
import { ICreateUser, IUpdateUser, IUserOnboarding } from '@/models/User';
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


const errorMessages = {
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
  languages: string
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


export const AboutYourSelfForm: FC<IProps> = ({ onNext }) => {
  const router = useRouter();
  const { theme } = useStyles();
  const formProps = useForm<IFormValues>({
    defaultValues,
    // resolver: yupResolver(validationSchema),
  });
  const userState = useCometaStore(state => state.onboarding.user);
  const { selectedCity, cityKind, setCityKind } = useSelectCityByName();
  const { selectedLanguages } = useSelectLanguages();
  const createUser = useMutationCreateUser();
  const updateUser = useMutationUpdateUserById();
  const uploadPhotos = useMutationUploadUserPhotos();

  const handleUserCreation = async (values: IFormValues): Promise<void> => {
    const createUserPayload: ICreateUser = {
      email: userState.email,
      name: userState.name,
      username: userState.username,
      uid: userState.uid, // from firebase
      birthday: userState.birthday,
    };
    const updateUserPayload: IUpdateUser = {
      biography: values.biography,
      currentLocation: values.currentLocation,
      homeTown: values.homeTown,
      languages: values.languages ? values.languages.split(',') : [],
      occupation: values.occupation
    };
    try {
      const newUser = await createUser.mutateAsync(createUserPayload);
      await uploadPhotos.mutateAsync({ userId: newUser.id, pickedImgFiles: userState.photos });
      await updateUser.mutateAsync({ userId: newUser.id, payload: updateUserPayload });
      onNext();
    } catch (error) {
      return;
    }
  };

  const navigateToSelectCity = (kind: keyof ICityKind) => {
    setCityKind(kind);
    router.push('/stacks/selectCity');
  };

  const navigateToSelectLanguages = () => {
    router.push('/stacks/selectLanguages');
  };

  // update form values homeTown and currentLocation
  useEffect(() => {
    if (!selectedCity) return;
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
            paddingVertical: theme.spacing.sp8,
            gap: theme.spacing.sp7
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
          text='Register'
          onNext={formProps.handleSubmit(handleUserCreation)}
        />
      </FormProvider>
    </>
  );
};
