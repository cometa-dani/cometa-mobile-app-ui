/* eslint-disable react-native/no-color-literals */
import { Image, Pressable, StyleSheet, TextInput } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { WrapperOnBoarding } from '../../components/onboarding/WrapperOnBoarding';

// // auth services
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import usersService from '../../services/usersService';


type UserForm = {
  email: string,
  password: string
}

export const loginSchemma = Yup.object<UserForm>({
  email: Yup.string().email().required(),
  password: Yup.string().min(8).required(),
});


const handleCreateUserWithProvider = async (provider: GoogleAuthProvider | FacebookAuthProvider) => {
  try {
    const { user } = await signInWithPopup(auth, provider);
    const payload = {
      username: user.displayName || '',
      avatar: user.photoURL || '',
      email: user.email || '',
      uid: user.uid,
    };
    const newUser = await usersService.createUser(payload);
    console.log('new user created!', newUser);
  }
  catch (error) {
    console.log((error as Error).message);
  }
};


export default function LoginScreen(): JSX.Element {
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

        <Link href={'/(onboarding)/start'}>
          <Text style={styles.title}>Log In</Text>
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
              <Text style={styles.buttonText}>Log In</Text>
            </Pressable>
          </View>
        )}
      </Formik>
      {/* create user with email and password */}

      <View style={styles.authProviders}>
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
      </View>

    </WrapperOnBoarding>
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
