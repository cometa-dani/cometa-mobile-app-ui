import { FC } from 'react';
import { UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { FieldText } from '@/components/input/fieldText';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useCometaStore } from '@/store/cometaStore';
import { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { Center } from '@/components/utils/stacks';
import { Heading } from '@/components/text/heading';
import { SafeAreaView, View } from 'react-native';
import { Button } from '@/components/button/button';
import { IUserOnboarding } from '@/models/User';


const testIds = {
  fullname: '#fullname',
  email: '#email',
  password: '#password',
  repeatPassword: '#repeatPassword',
  username: '#username',
  birthday: '#birthday',
};

const errorMessages = {
  email: 'Email is required',
  password: 'Password is required',
  repeatPassword: 'Verify Password again',
  name: 'Name is required',
  username: 'User Name is required',
  birthday: 'Birthday is required',
};

type IFormValues = Pick<IUserOnboarding, (
  'email' |
  'password' |
  'repassword' |
  'name' |
  'username' |
  'birthday'
)>

const validationSchema = Yup.object<IFormValues>().shape({
  email: Yup.string().email().required(errorMessages.email),
  password: Yup.string().min(6).max(18).required(errorMessages.password),
  repassword:
    Yup.string()
      .oneOf([Yup.ref('password'), ''])
      .required(errorMessages.repeatPassword),
  name: Yup.string().min(3).max(26).required(errorMessages.name),
  username: Yup.string().min(3).max(18).required(errorMessages.username),
  birthday: Yup.string().min(3).max(18).required(errorMessages.birthday),
});

const defaultValues: IFormValues = {
  email: '',
  password: '',
  repassword: '',
  name: '',
  username: '',
  birthday: '',
};

interface IProps {
  onNextStep: () => void;
}
export const CreateYourProfileForm: FC<IProps> = ({ onNextStep }) => {
  const { theme } = useStyles();
  const formProps = useForm({ defaultValues, resolver: yupResolver<IFormValues>(validationSchema) });
  const setOnboardingState = useCometaStore(state => state.setOnboarding);

  const handleUserState = (values: IFormValues): void => {
    setOnboardingState(values);
    console.log('handleNext', values);
    onNextStep();
  };

  return (
    <FormProvider
      {...formProps}
    >
      <BottomSheetView>
        <Center styles={{
          paddingTop: theme.spacing.sp12,
          paddingBottom: theme.spacing.sp2
        }}>
          <Heading size='s7'>Create Your Profile</Heading>
        </Center>
      </BottomSheetView>
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingVertical: theme.spacing.sp8,
          paddingHorizontal: theme.spacing.sp10,
          gap: theme.spacing.sp7,
        }}>
        <FieldText
          testId={testIds.fullname}
          label='Full Name'
          name='name'
          placeholder='Enter your Full Name'
          iconName='user'
          defaultErrMessage={errorMessages.name}
        />
        <FieldText
          testId={testIds.username}
          label='User Name'
          name='username'
          placeholder='Enter your User Name'
          iconName='at'
          defaultErrMessage={errorMessages.username}
        />
        <FieldText
          testId={testIds.birthday}
          label='Birthday'
          name='birthday'
          placeholder='Enter your birthday'
          iconName='calendar-check-o'
          isDateTimePicker={true}
          editable={false}
          defaultErrMessage={errorMessages.birthday}
        />
        <FieldText
          testId={testIds.email}
          label='Email'
          name='email'
          placeholder='Enter your Email'
          iconName='envelope'
          keyboardType='email-address'
          defaultErrMessage={errorMessages.email}
        />
        <FieldText
          testId={testIds.password}
          secureTextEntry={true}
          label='Password'
          name='password'
          placeholder='Enter your password'
          iconName='lock'
          defaultErrMessage={errorMessages.password}
        />
        <FieldText
          testId={testIds.repeatPassword}
          secureTextEntry={true}
          label='Re-enter Password'
          name='repassword'
          placeholder='Enter your password again'
          iconName='lock'
          defaultErrMessage={errorMessages.repeatPassword}
        />
        <Button
          variant='primary'
          onPressed={formProps.handleSubmit(handleUserState)}
        >
          Next
        </Button>
      </BottomSheetScrollView>
    </FormProvider>
  );
};
