import { FC, useReducer, useState } from 'react';
import { useStyles } from 'react-native-unistyles';
import { FieldText } from '@/components/input/fieldText';
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
import { Modal } from 'react-native';
import { SearchCityByName } from '@/components/modal/searchCityByName';


const errorMessages = {
  occupation: 'Write your usual or principal job or profession',
  biography: 'Something fun about yourself',
  currentLocation: 'Where you are currently',
  homeTown: 'Where you come from',
  languages: 'How many languages do you speak',
};

type IFormValues = Partial<Pick<IUserOnboarding, (
  'occupation' |
  'biography' |
  'currentLocation' |
  'homeTown' |
  'languages'
)>>

const validationSchema = Yup.object<IFormValues>().shape({
  occupation: Yup.string().min(5).max(120).optional(),
  biography: Yup.string().min(5).max(200).optional(),
  currentLocation: Yup.string().min(5).max(120).optional(),
  homeTown: Yup.string().min(5).max(120).optional(),
  languages: Yup.array().min(1).optional(),
});

const defaultValues: IFormValues = {
  occupation: '',
  biography: '',
  currentLocation: '',
  homeTown: '',
  languages: [],
};

type CityKind = 'homeTown' | 'currentLocation';

export const AboutYourSelfForm: FC<IProps> = ({ onNext }) => {
  const { theme } = useStyles();
  const formProps = useForm<IFormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema)
  });
  const userState = useCometaStore(state => state.onboarding.user);
  const createUser = useMutationCreateUser();
  const updateUser = useMutationUpdateUserById();
  const uploadPhotos = useMutationUploadUserPhotos();
  const [modalSelectCity, setModalSelectCity] = useReducer(prev => !prev, false);
  const [cityKind, setCityKind] = useState<CityKind>('homeTown');

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
      languages: values.languages,
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

  const handleOpenSelectCity = (kind: CityKind) => {
    setCityKind(kind);
    setModalSelectCity();
    // console.log(kind);
  };

  const handleCloseSelectCity = (cityName: string) => {
    setModalSelectCity();
    formProps.setValue(cityKind, cityName);
  };

  return (
    <>
      <Modal
        visible={modalSelectCity}
        onRequestClose={setModalSelectCity}
      // style={{ flex: 1 }}
      >
        <SearchCityByName
          placeholder={cityKind}
          onSaveCity={handleCloseSelectCity}
        />
      </Modal>

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
            placeholder='Enter your Languages'
            iconName='language'
            defaultErrMessage={errorMessages.languages}
          />
          <FieldText
            editable={false}
            label='Location'
            name='currentLocation'
            onShowSelector={() => handleOpenSelectCity('currentLocation')}
            placeholder='Enter your current Location'
            iconName='map-o'
            defaultErrMessage={errorMessages.currentLocation}
          />
          <FieldText
            editable={false}
            label='Home Town'
            name='homeTown'
            onShowSelector={() => handleOpenSelectCity('homeTown')}
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
