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
import { View } from 'react-native';
import { Button } from '@/components/button/button';


const errorMessages = {
  email: 'Email is required',
  password: 'Password is required',
  repeatPassword: 'Verify Password again',
  name: 'Name is required',
  username: 'User Name is required',
  birthday: 'Birthday is required',
};

type FormValues = {
  email: string;
  password: string;
  repassword: string;
  name: string;
  username: string;
  birthday: string;
}

const validationSchema = Yup.object<FormValues>().shape({
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

const defaultValues: FormValues = {
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
  const formProps = useForm<FormValues>({ defaultValues, resolver: yupResolver(validationSchema) });
  const setOnboardingState = useCometaStore(state => state.setOnboarding);

  const handleUserState = (values: FormValues): void => {
    setOnboardingState(values);
    console.log('handleNext', values);
    onNextStep();
  };

  return (
    <FormProvider {...formProps}>
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
          gap: theme.spacing.sp7
        }}>
        <FieldText
          label='Full Name'
          name='name'
          placeholder='Enter your Full Name'
          iconName='user'
          defaultErrMessage={errorMessages.name}
        />
        <FieldText
          label='User Name'
          name='username'
          placeholder='Enter your User Name'
          iconName='at'
          defaultErrMessage={errorMessages.username}
        />
        <FieldText
          label='Birthday'
          name='birthday'
          placeholder='Enter your birthday'
          iconName='calendar-check-o'
          defaultErrMessage={errorMessages.birthday}
        />
        <FieldText
          label='Email'
          name='email'
          placeholder='Enter your Email'
          iconName='envelope'
          keyboardType='email-address'
          defaultErrMessage={errorMessages.email}
        />
        <FieldText
          secureTextEntry={true}
          label='Password'
          name='password'
          placeholder='Enter your password'
          iconName='lock'
          defaultErrMessage={errorMessages.password}
        />
        <FieldText
          secureTextEntry={true}
          label='Re-enter Password'
          name='repassword'
          placeholder='Enter your password again'
          iconName='lock'
          defaultErrMessage={errorMessages.repeatPassword}
        />
        <View style={{ paddingBottom: UnistylesRuntime.insets.bottom }}>
          <Button variant='primary' onPressed={formProps.handleSubmit(handleUserState)}>
            Next
          </Button>
        </View>
      </BottomSheetScrollView>
    </FormProvider>
  );
};
