import { Image, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import { AppWrapperOnBoarding } from '../../components/onboarding/WrapperOnBoarding';

// // auth services
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useState } from 'react';
import { useCometaStore } from '../../store/cometaStore';
import { AppButton } from '../../components/buttons/buttons';
import { AppTextInput } from '../../components/textInput/AppTextInput';


type UserForm = {
  email: string,
  password: string
}

export const loginSchemma = Yup.object<UserForm>({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
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
        actions.resetForm();
        const { user } = await signInWithEmailAndPassword(auth, values.email, values.password);
        actions.setSubmitting(false);
        setAccessToken(await user.getIdToken());
        setUserUid(user.uid);
        setIsAuthenticated(true);
        setIsLoading(false);
        router.push('/(app)/');
      }
      catch (error) {
        console.log(error);
      }
    };

  return (
    <AppWrapperOnBoarding>
      <View style={{ flex: 1, width: '100%' }}>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 32 }}>
          <View>
            <Image style={styles.logo} source={require('../../assets/images/cometa-logo.png')} />

            <Text style={styles.title}>Log In</Text>
          </View>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchemma}
            onSubmit={handleLogin}>

            {({ handleSubmit, handleChange, handleBlur, values }) => (
              <View style={styles.form}>
                <AppTextInput
                  keyboardType="email-address"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  placeholder='Email'
                />
                <AppTextInput
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  placeholder='Password'
                  secureTextEntry={true}
                />

                <AppButton
                  btnColor='primary'
                  onPress={() => handleSubmit()}
                  text={isLoading ? 'Loading...' : 'Log In'}
                />
              </View>
            )}
          </Formik>
        </View>

        <AppButton
          btnColor='white'
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
  },

  logo: {
    aspectRatio: 1,
    height: 100,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
