import { Image, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import { AppWrapperOnBoarding } from '../../components/onboarding/WrapperOnBoarding';
import { useCometaStore } from '../../store/cometaStore';
import { AppButton } from '../../components/buttons/buttons';
import { AppTextInput } from '../../components/textInput/AppTextInput';


type UserForm = {
  email: string,
  password: string,
}

export const loginSchemma = Yup.object<UserForm>({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
});


export default function WhatIsYourEmailScreen(): JSX.Element {
  const setOnboarding = useCometaStore(state => state.setOnboarding);

  const handleNextSlide =
    async (values: UserForm, actions: FormikHelpers<UserForm>) => {
      try {
        setOnboarding({
          email: values.email,
          password: values.password
        });
        actions.resetForm();
        actions.setSubmitting(false);
        router.push('/(onboarding)/whenIsYourBirthday');
      }
      catch (error) {
        console.log(error);
      }
    };

  return (
    <AppWrapperOnBoarding>
      {/* logo */}
      <View style={styles.figure}>
        <Image style={styles.logo} source={require('../../assets/images/cometa-logo.png')} />

        <Text style={styles.title}>What is your email?</Text>
      </View>
      {/* logo */}

      {/* create user with email and password */}
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchemma}
        onSubmit={handleNextSlide}>

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
              keyboardType="ascii-capable"
              secureTextEntry={true}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              placeholder='Password'
            />

            <AppButton
              onPress={() => handleSubmit()}
              btnColor='primary'
              text='NEXT'
            />
          </View>
        )}
      </Formik>
      {/* create user with email and password */}

    </AppWrapperOnBoarding>
  );
}

const styles = StyleSheet.create({
  figure: {
    alignItems: 'center',
  },

  form: {
    flexDirection: 'column',
    gap: 26,
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
  }
});
