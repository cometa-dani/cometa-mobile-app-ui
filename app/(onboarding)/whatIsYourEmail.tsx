import { Image, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import { AppWrapperOnBoarding } from '../../components/onboarding/WrapperOnBoarding';
import { useCometaStore } from '../../store/cometaStore';
import { AppButton } from '../../components/buttons/buttons';
import { AppInputFeedbackMsg, AppTextInput } from '../../components/textInput/AppTextInput';
import { useEffect, useState } from 'react';
import userService from '../../services/userService';


type UserForm = {
  email: string,
  password: string,
}

export const loginSchemma = Yup.object<UserForm>({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).max(18).required(),
});


export default function WhatIsYourEmailScreen(): JSX.Element {
  const setOnboarding = useCometaStore(state => state.setOnboarding);
  const [isAvaibleToUse, setIsAvailableToUse] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [email, setEmail] = useState('');

  const handleNextSlide =
    (values: UserForm, actions: FormikHelpers<UserForm>): void => {
      if (!isAvaibleToUse || isFetching) return;
      try {
        setOnboarding({
          email: values.email,
          password: values.password
        });
        actions.resetForm();
        actions.setSubmitting(false);
        router.push('/(onboarding)/addPhotosAndVideos');
      }
      catch (error) {
        console.log(error);
      }
    };


  // checking if @username is available to used for current user
  useEffect(() => {
    const timoutId = setTimeout(async () => {
      if (email.includes('@')) {
        try {
          setIsFetching(true);
          const res = await userService.getUsersWithFilters({ email });
          if (res.status === 204) {
            setIsAvailableToUse(true);
          }
          else {
            setIsAvailableToUse(false);
          }
          setIsFetching(false);
        }
        catch (error) {
          console.log(error);
          setIsFetching(false);
          setIsAvailableToUse(false);
        }
      }
    }, 1_200);

    return () => clearTimeout(timoutId);
  }, [email]);


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

        {({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
          <View style={styles.form}>

            <View style={{ position: 'relative' }}>
              {touched.email && errors.email && (
                <AppInputFeedbackMsg text={errors.email} />
              )}
              {!errors.email && !isAvaibleToUse && (
                <AppInputFeedbackMsg text='Your email already exists' />
              )}
              <AppTextInput
                iconName='envelope-o'
                keyboardType="email-address"
                onChangeText={(text) => {
                  handleChange('email')(text);
                  setEmail(text);
                }}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholder='Email'
              />
            </View>

            <View style={{ position: 'relative' }}>
              {touched.password && errors.password && (
                <AppInputFeedbackMsg text={errors.password} />
              )}
              <AppTextInput
                iconName='key'
                keyboardType="ascii-capable"
                secureTextEntry={true}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                placeholder='Password'
              />
            </View>

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
