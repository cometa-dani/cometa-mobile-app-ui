/* eslint-disable react-native/no-color-literals */
import { Image, Pressable, StyleSheet, TextInput } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

// // auth services
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  // signInWithPopup
} from 'firebase/auth';
import { auth } from 'firebase/firebase';
import usersService from 'services/usersService';
import { useEffect } from 'react';


type UserForm = {
  email: string,
  password: string
}

export const loginSchemma = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(8).required(),
});


const handleRegisterWithProvider = async (provider: GoogleAuthProvider | FacebookAuthProvider) => {
  try {
    // const { user, providerId } = await signInWithPopup(auth, provider); // opens pop-up
    // swiper.slideNext(); //swipes to loading view

    // const accessToken = await user.getIdToken();

    // console.log(user, accessToken, providerId);

    // const userExists: boolean = await larnUService.userExists(user.uid, accessToken);
    // storageService.save('accessToken', accessToken);
    // storageService.save('userID', user.uid);

    // if (!userExists) {
    //   // await larnUService.createUser({
    //   //   email: user.email || '',
    //   //   first_name: user.displayName || '',
    //   //   uid: user.uid,
    //   //   device_token: user.uid
    //   // });
    // }
    // else {
    //   // 1. notify to the backend that the user has logged-in from register-form (web-app)
    //   // await eventsService.sent(providerId);
    // }

    // navigate('/'); // access granted to the App
  }
  catch (error) {
    console.log((error as Error).message);
  }
};


export default function RegisterScreen(): JSX.Element {
  const { primary100, background, text } = useColors();

  const handleCreateUserWithEmailAndPassword =
    async (values: UserForm, actions: FormikHelpers<UserForm>) => {
      try {
        actions.resetForm();
        const { user } = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const payload = {
          username: user.displayName || '',
          avatar: user.photoURL || '',
          email: user.email || '',
          uid: user.uid,
        };
        const newUser = await usersService.createUser(payload);
        console.log('new user created!', newUser);
        actions.setSubmitting(false);
      }
      catch (error) {
        console.log(error);
      }
    };


  const handleGoogleAuthentication = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ display: 'popup', prompt: 'select_account' });

    handleRegisterWithProvider(provider);
  };


  const handleFacebookAuthentication = async () => {
    const provider = new FacebookAuthProvider();
    provider.addScope('public_profile');
    provider.addScope('email');
    provider.setCustomParameters({ display: 'popup', prompt: 'select_account' });

    handleRegisterWithProvider(provider);
  };

  // useEffect(() => {
  //   console.log('initial values');
  // });

  return (
    <View style={styles.container}>

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
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchemma}
        onSubmit={handleCreateUserWithEmailAndPassword}>

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
              <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>
          </View>
        )}
      </Formik>
      {/* create user with email and password */}

      <View style={styles.authProviders}>
        <Pressable
          onPress={() => handleGoogleAuthentication()}
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
          onPress={() => handleFacebookAuthentication()}
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
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  authProviders: {
    flexDirection: 'row',
    gap: 20,
  },

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

  container: {
    alignItems: 'center',
    flex: 1,
    flexGrow: 1,
    gap: 40,
    justifyContent: 'center',
    padding: 26
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
