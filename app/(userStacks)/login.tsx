import { SystemBars } from 'react-native-edge-to-edge';
import { Stack, useRouter } from 'expo-router';
import { FormProvider, useForm } from 'react-hook-form';
import { FieldText } from '@/components/input/textField';
import { testIds } from '@/components/onboarding/user/steps/components/testIds';
import { errorMessages } from '@/components/onboarding/user/steps/createYourProfile';
import { IUserOnboarding } from '@/models/User';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Heading } from '@/components/text/heading';
import { useStyles } from 'react-native-unistyles';
import { Button } from '@/components/button/button';
import { supabase } from '@/supabase/config';
import { Notifier } from 'react-native-notifier';
import { InfoToast, SucessToast } from '@/components/toastNotification/toastNotification';
import { AxiosError } from 'axios';


type IFormValues = Pick<IUserOnboarding, (
  'email' |
  'password'
)>

const defaultValues: IFormValues = {
  email: '',
  password: ''
};

const validationSchema = Yup.object<IFormValues>().shape({
  email: Yup.string().email().required(errorMessages.email),
  password: Yup.string().min(6).max(18).required(errorMessages.password),
});

export default function LoginScreen() {
  const { theme } = useStyles();
  const router = useRouter();
  const formProps = useForm({
    defaultValues,
    resolver: yupResolver<IFormValues>(validationSchema),
  });

  const handleSignIn = async (values: IFormValues) => {
    Notifier.showNotification({
      duration: 0,
      title: 'Signing in',
      description: 'wait a moment...',
      Component: InfoToast,
    });
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
      });
      if (error) {
        return error.name;
      }
      Notifier.hideNotification();
      Notifier.showNotification({
        title: 'Welcome',
        description: 'you are logged in',
        Component: SucessToast
      });
      router.replace('/(userTabs)/');
    } catch (error) {
      Notifier.hideNotification();
      Notifier.showNotification({
        title: 'Error',
        description: `there was an error: ${(error as AxiosError).message}`,
        Component: InfoToast
      });
    }
  };

  return (
    <>
      <SystemBars style='auto' />

      <Stack.Screen
        options={{
          gestureDirection: 'vertical',
          fullScreenGestureEnabled: true,
          gestureEnabled: true,
          headerTitle: '',
          headerShown: true,
          animation: 'slide_from_bottom',
          contentStyle: {
            backgroundColor: theme.colors.white100
          }
        }}
      />

      <FormProvider {...formProps}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          bottomOffset={theme.spacing.sp10}
          bounces={false}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: theme.spacing.sp24,
            paddingHorizontal: theme.spacing.sp10,
            paddingBottom: theme.spacing.sp14,
            gap: theme.spacing.sp7,
          }}
        >
          <Heading
            style={{ textAlign: 'center', marginBottom: theme.spacing.sp10 }}
            size='s7'
          >
            Sign in
          </Heading>
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
          <Button
            style={{ marginTop: theme.spacing.sp10 }}
            variant='primary'
            onPress={formProps.handleSubmit(handleSignIn)}
          >
            Sign in
          </Button>
        </KeyboardAwareScrollView>
      </FormProvider>
    </>
  );
}
