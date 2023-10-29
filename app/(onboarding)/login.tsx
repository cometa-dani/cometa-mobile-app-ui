import { Image, Pressable, StyleSheet, TextInput } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import { WrapperOnBoarding } from '../../components/onboarding/WrapperOnBoarding';

// // auth services
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useState } from 'react';
import { useCometaStore } from '../../store/cometaStore';


type UserForm = {
  email: string,
  password: string
}

export const loginSchemma = Yup.object<UserForm>({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});


export default function LoginScreen(): JSX.Element {
  const { primary100, background } = useColors();
  const [isLoading, setIsLoading] = useState(false);
  const setAccessToken = useCometaStore(state => state.setAccessToken);
  const setIsAuthenticated = useCometaStore(state => state.setIsAuthenticated);

  const handleLogin =
    async (values: UserForm, actions: FormikHelpers<UserForm>) => {
      try {
        setIsLoading(true);
        actions.resetForm();
        const { user } = await signInWithEmailAndPassword(auth, values.email, values.password);
        actions.setSubmitting(false);
        setIsAuthenticated(true);
        setAccessToken(await user.getIdToken());
        setIsLoading(false);
        router.push('/(app)/');
      }
      catch (error) {
        console.log(error);
      }
    };

  return (
    <WrapperOnBoarding>

      {/* logo */}
      <View>
        <Image style={styles.logo} source={require('../../assets/images/cometa-logo.png')} />

        <Text style={styles.title}>Log In</Text>
      </View>
      {/* logo */}

      {/* create user with email and password */}
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchemma}
        onSubmit={handleLogin}>

        {({ handleSubmit, handleChange, handleBlur, values }) => (
          <View style={styles.form}>
            <TextInput
              keyboardType="email-address"
              style={styles.input}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              placeholder='Email'
            />
            <TextInput
              style={styles.input}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              placeholder='Password'
              secureTextEntry={true}
            />

            <Pressable
              onPress={() => handleSubmit()}
              style={[{
                backgroundColor: primary100
              },
              styles.button
              ]}>
              <Text style={styles.buttonText}>{isLoading ? 'Loading...' : 'Log In'}</Text>
            </Pressable>
          </View>
        )}
      </Formik>
      {/* create user with email and password */}

      <Pressable
        onPress={() => router.push('/(onboarding)/register')}
        style={[{
          position: 'absolute',
          bottom: 30,
          backgroundColor: background,
          width: '100%',
          gap: 8
        },
        styles.button
        ]}>
        <Text
          style={[
            styles.buttonText,
            {
              color: '#6c6c6c',
              fontWeight: '500',
              fontSize: 18,
              textTransform: 'none'
            }]}>
          Don&apos;t have an account? Sign Up
        </Text>
      </Pressable>

    </WrapperOnBoarding>
  );
}

const styles = StyleSheet.create({

  button: {
    borderRadius: 50,
    elevation: 3,
    paddingHorizontal: 28,
    paddingVertical: 14,
    shadowColor: '#171717',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase'
  },


  form: {
    flexDirection: 'column',
    gap: 32,
    justifyContent: 'center',
    width: '100%'
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 50,
    elevation: 3,
    paddingHorizontal: 28,
    paddingVertical: 14,
    shadowColor: '#171717',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },

  logo: {
    aspectRatio: 1,
    height: 100,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  }
});
