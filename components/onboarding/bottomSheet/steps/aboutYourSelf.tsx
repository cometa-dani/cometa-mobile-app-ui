import { FC } from 'react';
import { useStyles } from 'react-native-unistyles';
import { FieldText } from '@/components/input/fieldText';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useCometaStore } from '@/store/cometaStore';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Center } from '@/components/utils/stacks';
import { Heading } from '@/components/text/heading';
import { Button } from '@/components/button/button';
import { ICreateUser, IUpdateUser, IUserOnboarding } from '@/models/User';
import {
  useMutationCreateUser,
  useMutationUpdateUserById,
  useMutationUploadUserPhotos
} from '@/queries/currentUser/userHooks';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';


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
      <BottomSheetView>
        <Center styles={{
          paddingTop: theme.spacing.sp12,
          paddingBottom: theme.spacing.sp2
        }}>
          <Heading size='s7'>About Yourself</Heading>
        </Center>
      </BottomSheetView>
      <KeyboardAwareScrollView
        bottomOffset={110}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.sp10,
          paddingVertical: theme.spacing.sp8,
          gap: theme.spacing.sp7,
        }}>
        <FieldText
          isInsideBottomSheet={true}
          label='Occupation'
          name='occupation'
          placeholder='Enter your Occupation'
          iconName='suitcase'
          defaultErrMessage={errorMessages.occupation}
        />
        <FieldText
          isInsideBottomSheet={true}
          label='Bio'
          multiline={true}
          name='biography'
          placeholder='Enter your Biography'
          iconName='sticky-note-o'
          defaultErrMessage={errorMessages.biography}
        />
        <FieldText
          isInsideBottomSheet={true}
          editable={false}
          label='Languages you know'
          name='languages'
          placeholder='Enter your Languages'
          iconName='language'
          defaultErrMessage={errorMessages.languages}
        />
        <FieldText
          isInsideBottomSheet={true}
          editable={false}
          label='Location'
          name='currentLocation'
          placeholder='Enter your current Location'
          iconName='map-o'
          defaultErrMessage={errorMessages.currentLocation}
        />
        <FieldText
          isInsideBottomSheet={true}
          editable={false}
          label='Home Town'
          name='homeTown'
          placeholder='Enter your home Town'
          iconName='map-marker'
          defaultErrMessage={errorMessages.homeTown}
        />

        <Button
          isInsideBottomSheet={true}
          style={{ marginTop: theme.spacing.sp8 }}
          variant='primary'
          onPress={formProps.handleSubmit(handleUserCreation)}
        >
          Register
        </Button>
      </KeyboardAwareScrollView>
    </FormProvider>
  );
};
