import { Image, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import { AppWrapperOnBoarding, onBoardingStyles } from '../../components/onboarding/WrapperOnBoarding';

// // auth services
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase/firebase';
import { useState } from 'react';
import { useCometaStore } from '../../store/cometaStore';
import { AppButton, LightButton } from '../../components/buttons/buttons';
import { AppLabelFeedbackMsg, AppTextInput } from '../../components/textInput/AppTextInput';
import { If } from '../../components/utils';
import ToastManager, { Toast } from 'toastify-react-native';


type UserForm = {
  email: string,
  password: string
}

export const loginSchemma = Yup.object<UserForm>({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).max(18).required(),
});


export default function LoginScreen(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const setCurrentUserAccessToken = useCometaStore(state => state.setAccessToken);
  const setIsCurrentUserAuthenticated = useCometaStore(state => state.setIsAuthenticated);
  const setCurrentUserUid = useCometaStore(state => state.setUid);
  const [firebaseError, setFirebaseError] = useState('');

  const handleLogin =
    async (values: UserForm, actions: FormikHelpers<UserForm>) => {
      try {
        setIsLoading(true);
        const { user } = await signInWithEmailAndPassword(auth, values.email, values.password);
        actions.setSubmitting(false);
        setCurrentUserAccessToken(await user.getIdToken());
        setCurrentUserUid(user.uid);
        setIsCurrentUserAuthenticated(true);
        router.push('/(app)/');
      }
      catch (error) {
        setFirebaseError('credentials are invalid');
        Toast.error('invalid credentials 🤯', 'top');

        setTimeout(() => {
          ToastManager.__singletonRef?.hideToast();
        }, 3_500);
      }
      finally {
        setIsLoading(false);
      }
    };


  return (
    <AppWrapperOnBoarding>
      <View style={{ flex: 1, width: '100%' }}>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 32 }}>
          <View>
            <Image style={onBoardingStyles.logo} source={require('../../assets/images/cometa-logo.png')} />

            <Text size='lg' style={{ textAlign: 'center' }}>Log In</Text>
          </View>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchemma}
            onSubmit={handleLogin}
          >
            {({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => {
              return (
                <View style={styles.form}>

                  <View style={{ position: 'relative', justifyContent: 'center' }}>
                    {touched.email && errors.email && (
                      <AppLabelFeedbackMsg position='bottom' text={errors.email} />
                    )}
                    <If
                      condition={firebaseError}
                      render={(
                        <AppLabelFeedbackMsg position='bottom' text={firebaseError}
                        />
                      )}
                    />
                    <AppTextInput
                      iconName='envelope-o'
                      keyboardType="email-address"
                      onChangeText={(text) => {
                        if (firebaseError) setFirebaseError('');
                        handleChange('email')(text);
                      }}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      placeholder='Email'
                    />
                  </View>

                  <View style={{ position: 'relative', justifyContent: 'center' }}>
                    {touched.password && errors.password && (
                      <AppLabelFeedbackMsg position='bottom' text={errors.password} />
                    )}
                    <If
                      condition={firebaseError}
                      render={(
                        <AppLabelFeedbackMsg position='bottom' text={firebaseError}
                        />
                      )}
                    />
                    <AppTextInput
                      iconName='lock'
                      onChangeText={(text) => {
                        if (firebaseError) setFirebaseError('');
                        handleChange('password')(text);
                      }}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      placeholder='Password'
                      secureTextEntry={true}
                    />
                  </View>

                  <AppButton
                    btnColor='primary'
                    onPress={() => handleSubmit()}
                    text={isLoading ? 'Loading...' : 'Log In'}
                  />
                </View>
              );
            }}
          </Formik>
        </View>

        <LightButton
          onPress={() => router.push('/(onboarding)/whenIsYourBirthday')}
          text='Don&apos;t have an account? Sign Up'
        />

      </View>
    </AppWrapperOnBoarding>
  );
}

const styles = StyleSheet.create({
  form: {
    flexDirection: 'column',
    gap: 32,
    justifyContent: 'center',
    width: '100%'
  }
});
