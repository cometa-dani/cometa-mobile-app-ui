/* eslint-disable react-native/no-color-literals */
import { Image, Pressable, StyleSheet, TextInput } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'expo-router';


export const loginSchemma = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

export default function RegisterScreen(): JSX.Element {

  const { primary100 } = useColors();

  return (
    <View style={styles.container}>


      <View>
        <Image style={styles.logo} source={require('../../assets/images/cometa-logo.png')} />

        <Link href={'/(onboarding)/login'}>
          <Text style={styles.title}>Sign Up</Text>
        </Link>
      </View>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchemma}
        onSubmit={
          (values) => console.log(values)
        }>
        {({ handleChange, handleBlur, values }) => (
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

            <Pressable style={[{ backgroundColor: primary100 }, styles.button]}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    paddingVertical: 16,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    paddingHorizontal: 28,
    textAlign: 'center',
    textTransform: 'uppercase'
  },

  container: {
    alignItems: 'center',
    flex: 1,
    flexGrow: 1,
    gap: 40,
    justifyContent: 'center',
    padding: 30
  },
  form: {
    flexDirection: 'column',
    gap: 20,
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
