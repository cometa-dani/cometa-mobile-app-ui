import { FC } from 'react';
import { useStyles } from 'react-native-unistyles';
import { FieldText } from '@/components/input/textField';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useCometaStore } from '@/store/cometaStore';
import { IUserOnboarding } from '@/models/User';
import { testIds } from './components/testIds';
import { KeyboardAwareScrollView, } from 'react-native-keyboard-controller';
import { FooterButton } from './components/footerButton';
import { IProps } from './components/interface';
import { supabase } from '@/supabase/config';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';


export const errorMessages = {
  email: 'Email is required',
  password: 'Password is required',
  repeatPassword: 'Verify Password again',
  name: 'Name is required',
  username: 'User Name is required',
  birthday: 'Birthday is required',
};

export type IFormValues = Pick<IUserOnboarding, (
  'email' |
  'password' |
  'repassword' |
  'name' |
  'username' |
  'birthday'
)>

export const validationSchema = Yup.object<IFormValues>().shape({
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

export const defaultValues: IFormValues = {
  email: '',
  password: '',
  repassword: '',
  name: '',
  username: '',
  birthday: '',
};

export const CreateYourProfileForm: FC<IProps> = ({ onNext }) => {
  const { theme } = useStyles();
  const setOnboardingState = useCometaStore(state => state.setOnboarding);
  const formProps = useForm({
    defaultValues,
    resolver: yupResolver<IFormValues>(validationSchema),
  });

  const handleUserState = (values: IFormValues): void => {
    setOnboardingState(values);
    onNext();
  };

  // watch email and username
  const [email, username]: [string, string] = formProps.watch(['email', 'username']);

  // check if email is available
  useDebouncedCallback(() => {
    supabase
      .from('User')
      .select('email')
      .eq('email', email.trim())
      .single()
      .then((res) => {
        if (res.status === 200) {
          formProps.setError('email', {
            type: 'required',
            message: 'Email already exists',
          });
        }
        else {
          formProps.clearErrors('email');
        }
      });
  }, [email]);

  // check if username is available
  useDebouncedCallback(() => {
    supabase
      .from('User')
      .select('username')
      .eq('username', (username.startsWith('@') ? username : '@' + username).trim())
      .single()
      .then((res) => {
        if (res.status === 200) {
          formProps.setError('username', {
            type: 'required',
            message: 'Username already exists',
          });
        }
        else {
          formProps.clearErrors('username');
        }
      });
  }, [username]);

  return (
    <FormProvider  {...formProps}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        bottomOffset={theme.spacing.sp10}
        bounces={false}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.sp10,
          paddingBottom: theme.spacing.sp14,
          gap: theme.spacing.sp7,
        }}
      >
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
          isDateTimePicker={true}
          testId={testIds.birthday}
          label='Birthday'
          name='birthday'
          placeholder='Enter your birthday'
          iconName='calendar-check-o'
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
      </KeyboardAwareScrollView>

      <FooterButton
        text='Next'
        onNext={formProps.handleSubmit(handleUserState)}
      />
    </FormProvider>
  );
};
