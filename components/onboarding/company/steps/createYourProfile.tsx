import { FC, useState } from 'react';
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
import { ICompanyOnboarding } from '@/models/company/Company';
import { Notifier } from 'react-native-notifier';
import { AxiosError } from 'axios';
import { AuthError } from '@supabase/supabase-js';
import { ErrorToast, InfoToast, SucessToast } from '@/components/toastNotification/toastNotification';
import { router } from 'expo-router';
import { useMutateCreateOrganization } from '@/queries/organization/organizationHooks';


export const errorMessages = {
  email: 'Email is required',
  password: 'Password is required',
  repeatPassword: 'Verify Password again',
  name: 'Name is required',
};

export const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(errorMessages.email),
  name: Yup.string().min(3).max(26).required(errorMessages.name),
  password: Yup.string().min(6).max(18).required(errorMessages.password),
  repassword:
    Yup.string()
      .oneOf([Yup.ref('password'), ''])
      .required(errorMessages.repeatPassword),
});

export const defaultValues: ICompanyOnboarding = {
  name: '',
  email: '',
  password: '',
  repassword: '',
};

export const CreateProfileForm: FC<IProps> = ({ onNext }) => {
  const { theme } = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const createOrganization = useMutateCreateOrganization();
  const formProps = useForm({
    defaultValues,
    resolver: yupResolver<ICompanyOnboarding>(validationSchema),
  });

  const handleUserState = async (values: ICompanyOnboarding) => {
    setIsLoading(true);
    Notifier.showNotification({
      duration: 0,
      title: 'Creating your profile',
      description: 'your profile is being created',
      Component: InfoToast,
    });
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            role: 'company',
          },
        },
      });
      if (error) throw error;
      await createOrganization.mutateAsync({
        name: values.name,
        email: values.email,
        uid: data?.user?.id ?? '',
      });
      Notifier.hideNotification();
      Notifier.showNotification({
        title: `Welcome to cometa ${values.name}`,
        description: 'Congrats, your profile was created successfully',
        Component: SucessToast,
      });
      router.replace('/(companyTabs)/');
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

  // watch email and username
  // const [email, name] = formProps.watch(['email', 'name']);

  // // check if email is available
  // useDebouncedCallback(() => {
  //   supabase
  //     .from('Organization')
  //     .select('email')
  //     .eq('email', email.trim())
  //     .single()
  //     .then((res) => {
  //       if (res.status === 200) {
  //         formProps.setError('email', {
  //           type: 'required',
  //           message: 'Email already exists',
  //         });
  //       }
  //       else {
  //         formProps.clearErrors('email');
  //       }
  //     });
  // }, [email]);

  // // check if username is available
  // useDebouncedCallback(() => {
  //   supabase
  //     .from('Organization')
  //     .select('name')
  //     .eq('name', (name.startsWith('@') ? name : '@' + name).trim())
  //     .single()
  //     .then((res) => {
  //       if (res.status === 200) {
  //         formProps.setError('name', {
  //           type: 'required',
  //           message: 'Username already exists',
  //         });
  //       }
  //       else {
  //         formProps.clearErrors('name');
  //       }
  //     });
  // }, [name]);

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
