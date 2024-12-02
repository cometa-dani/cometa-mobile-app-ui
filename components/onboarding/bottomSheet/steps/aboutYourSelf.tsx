import { FC } from 'react';
import { useStyles } from 'react-native-unistyles';
import { FieldText } from '@/components/input/fieldText';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useCometaStore } from '@/store/cometaStore';
import { Center } from '@/components/utils/stacks';
import { Heading } from '@/components/text/heading';
import { ICreateUser, IUpdateUser, IUserOnboarding } from '@/models/User';
import {
  useMutationCreateUser,
  useMutationUpdateUserById,
  useMutationUploadUserPhotos
} from '@/queries/currentUser/userHooks';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { NextButton } from './components/nextButton';


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

interface IProps {
  onNextStep: () => void;
}
export const AboutYourSelfForm: FC<IProps> = ({ onNextStep }) => {
  const { theme } = useStyles();
  const formProps = useForm({ defaultValues, resolver: yupResolver<IFormValues>(validationSchema) });
  const userState = useCometaStore(state => state.onboarding.user);
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
      languages: values.languages,
      occupation: values.occupation
    };
    try {
      const newUser = await createUser.mutateAsync(createUserPayload);
      await uploadPhotos.mutateAsync({ userId: newUser.id, pickedImgFiles: userState.photos });
      await updateUser.mutateAsync({ userId: newUser.id, payload: updateUserPayload });
      onNextStep();
    } catch (error) {
      return;
    }
  };

  return (
    <FormProvider {...formProps}>

      <Center styles={{
        paddingTop: theme.spacing.sp12,
        paddingBottom: theme.spacing.sp2
      }}>
        <Heading size='s7'>About Yourself</Heading>
      </Center>

      <KeyboardAwareScrollView
        bottomOffset={theme.spacing.sp10}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.sp10,
          paddingVertical: theme.spacing.sp8,
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
          placeholder='Enter your Languages'
          iconName='language'
          defaultErrMessage={errorMessages.languages}
        />
        <FieldText
          editable={false}
          label='Location'
          name='currentLocation'
          placeholder='Enter your current Location'
          iconName='map-o'
          defaultErrMessage={errorMessages.currentLocation}
        />
        <FieldText
          editable={false}
          label='Home Town'
          name='homeTown'
          placeholder='Enter your home Town'
          iconName='map-marker'
          defaultErrMessage={errorMessages.homeTown}
        />
      </KeyboardAwareScrollView>

      <NextButton
        text='Register'
        onNext={formProps.handleSubmit(handleUserCreation)}
      />
    </FormProvider>
  );
};
