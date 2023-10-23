/* eslint-disable react-native/no-color-literals */
import { Image, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'expo-router';


export const loginSchemma = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

export default function RegisterScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../../assets/images/cometa-logo.png')} />

      <Link href={'/(onboarding)/login'}>
        <Text style={styles.title}>Sign Up</Text>
      </Link>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchemma}
        onSubmit={
          (values) => console.log(values)
        }>
        {({ handleChange, handleBlur, values }) => (
          <View>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              placeholder='email'
            />
            <TextInput
              style={styles.input}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              placeholder='password'
            />
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    padding: 8,
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logo: {
    aspectRatio: 1,
    height: 100
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  }
});
