import { Image, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import { AppWrapperOnBoarding, onBoardingStyles } from '../../components/onboarding/WrapperOnBoarding';

// // auth services
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useState } from 'react';
import { useCometaStore } from '../../store/cometaStore';
import { AppButton, LightButton } from '../../components/buttons/buttons';
import { AppLabelFeedbackMsg, AppTextInput } from '../../components/textInput/AppTextInput';


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
  const setAccessToken = useCometaStore(state => state.setAccessToken);
  const setIsAuthenticated = useCometaStore(state => state.setIsAuthenticated);
  const setUserUid = useCometaStore(state => state.setUid);

  const handleLogin =
    async (values: UserForm, actions: FormikHelpers<UserForm>) => {
      try {
        setIsLoading(true);
        // actions.resetForm();
        const { user } = await signInWithEmailAndPassword(auth, values.email, values.password);
        actions.setSubmitting(false);
        // console.log(await user.getIdToken());
        setAccessToken(await user.getIdToken());
        setUserUid(user.uid);
        setIsAuthenticated(true);
        setIsLoading(false);
        router.push('/(app)/');
      }
      catch (error) {
        // console.log(error);
      }
    };

  return (
    <AppWrapperOnBoarding>
      <View style={{ flex: 1, width: '100%' }}>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 32 }}>
          <View>
            <Image style={onBoardingStyles.logo} source={require('../../assets/images/cometa-logo.png')} />

            <Text style={onBoardingStyles.title}>Log In</Text>
          </View>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchemma}
            onSubmit={handleLogin}>

            {({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
              <View style={styles.form}>

                <View style={{ position: 'relative', justifyContent: 'center' }}>
                  {touched.email && errors.email && (
                    <AppLabelFeedbackMsg position='bottom' text={errors.email} />
                  )}
                  <AppTextInput
                    iconName='envelope-o'
                    keyboardType="email-address"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    placeholder='Email'
                  />
                </View>

                <View style={{ position: 'relative', justifyContent: 'center' }}>
                  {touched.password && errors.password && (
                    <AppLabelFeedbackMsg position='bottom' text={errors.password} />
                  )}
                  <AppTextInput
                    iconName='lock'
                    onChangeText={handleChange('password')}
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
            )}
          </Formik>
        </View>

        <LightButton
          onPress={() => router.push('/(onboarding)/whatIsYourName')}
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
