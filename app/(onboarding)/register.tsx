/* eslint-disable react-native/no-color-literals */
import { Image, Pressable, StyleSheet, TextInput } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Link, router } from 'expo-router';
import { WrapperOnBoarding } from '../../components/onboarding/WrapperOnBoarding';


// // auth services
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  // signInWithPopup
} from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import usersService from '../../services/usersService';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';


type UserForm = {
  name: string,
  email: string,
  password: string
}

export const loginSchemma = Yup.object<UserForm>({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
});


// eslint-disable-next-line no-unused-vars
const handleCreateUserWithProvider = async (provider: GoogleAuthProvider | FacebookAuthProvider) => { };


export default function RegisterScreen(): JSX.Element {
  const { primary100 } = useColors();
  const [isLoading, setIsLoading] = useState(false);


  const handleCreateUserWithEmailAndPassword =
    async (values: UserForm, actions: FormikHelpers<UserForm>) => {
      try {
        setIsLoading(true);
        actions.resetForm();
        const { user } = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const payload = {
          username: values.name,
          email: user.email,
          uid: user.uid,
        };
        await usersService.createUser(payload);
        setIsLoading(false);
        actions.setSubmitting(false);

        router.push('/(onboarding)/uploadImage');
      }
      catch (error) {
        console.log(error);
      }
    };


  // eslint-disable-next-line no-unused-vars
  const handleGoogleAuthentication = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ display: 'popup', prompt: 'select_account' });

    handleCreateUserWithProvider(provider);
  };


  // eslint-disable-next-line no-unused-vars
  const handleFacebookAuthentication = async () => {
    const provider = new FacebookAuthProvider();
    provider.addScope('public_profile');
    provider.addScope('email');
    provider.setCustomParameters({ display: 'popup', prompt: 'select_account' });

    handleCreateUserWithProvider(provider);
  };


  return (
    <WrapperOnBoarding>

      {/* logo */}
      <View>
        <Image style={styles.logo} source={require('../../assets/images/cometa-logo.png')} />

        <Link href={'/(onboarding)/login'}>
          <Text style={styles.title}>Sign Up</Text>
        </Link>
      </View>
      {/* logo */}

      {/* create user with email and password */}
      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={loginSchemma}
        onSubmit={handleCreateUserWithEmailAndPassword}>

        {({ handleSubmit, handleChange, handleBlur, values }) => (
          <View style={styles.form}>
            <TextInput
              keyboardType="ascii-capable"
              style={styles.input}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              placeholder='Name'
            />
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
              {!isLoading && (
                <FontAwesome name='spinner' size={24} style={{ color: '#fff' }} />
              )}
              <Text style={styles.buttonText}>{isLoading ? 'Loading' : 'Next'}</Text>
            </Pressable>

          </View>
        )}
      </Formik>
      {/* create user with email and password */}

      {/* <View style={styles.authProviders}>
        <Pressable
          style={[{
            backgroundColor: background,
            flex: 1,
            flexDirection: 'row',
            gap: 8
          },
          styles.button
          ]}>
          <FontAwesome name='google' size={24} style={{ color: text }} />
          <Text style={[styles.buttonText, { color: text, fontSize: 17 }]}>Google</Text>
        </Pressable>
        <Pressable
          style={[{
            backgroundColor: background,
            flex: 1,
            flexDirection: 'row',
            gap: 8
          },
          styles.button
          ]}>
          <FontAwesome name='facebook' size={24} style={{ color: text }} />
          <Text style={[styles.buttonText, { color: text, fontSize: 17 }]}>Facebook</Text>
        </Pressable>
      </View> */}

    </WrapperOnBoarding>
  );
}

const styles = StyleSheet.create({

  // authProviders: {
  //   flexDirection: 'row',
  //   gap: 20,
  // },

  button: {
    borderRadius: 50,
    elevation: 3,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
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
    gap: 26,
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
