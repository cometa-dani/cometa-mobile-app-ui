import { Image, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import { AppWrapperOnBoarding } from '../../components/onboarding/WrapperOnBoarding';
import { useCometaStore } from '../../store/cometaStore';
import { AppButton } from '../../components/buttons/buttons';
import { AppLabelFeedbackMsg, AppLabelMsgOk, AppTextInput } from '../../components/textInput/AppTextInput';
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
  const onboarding = useCometaStore(state => state.onboarding.user);
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
        actions.setSubmitting(false);
        router.push('/(onboarding)/whenIsYourBirthday');
      }
      catch (error) {
        // console.log(error);
      }
    };


  // checking if @username is available to used for current user
  useEffect(() => {
    const timeOutId = setTimeout(async () => {
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
          // console.log(error);
          setIsFetching(false);
          setIsAvailableToUse(false);
        }
      }
    }, 1_200);

    return () => clearTimeout(timeOutId);
  }, [email]);


  return (
    <AppWrapperOnBoarding>
      {/* logo */}
      <View style={styles.figure}>
        <Image style={styles.logo} source={require('../../assets/images/cometa-logo.png')} />

        <Text style={styles.title}>What is your email?</Text>
      </View>
      {/* logo */}

      <Formik
        initialValues={{ email: onboarding.email || '', password: onboarding.password || '' }}
        validationSchema={loginSchemma}
        onSubmit={handleNextSlide}
      >
        {({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
          <View style={styles.form}>

            {/* email */}
            <View style={{ position: 'relative' }}>
              {touched.email && errors.email && (
                <AppLabelFeedbackMsg text={errors.email} />
              )}
              {!isFetching && values.email.includes('@') && !errors.email && !isAvaibleToUse && (
                <AppLabelFeedbackMsg text='Your email already exists' />
              )}
              {!isFetching && values.email.includes('@') && !errors.email && isAvaibleToUse && (
                <AppLabelMsgOk text='email' />
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
            {/* email */}

            {/* password */}
            <View style={{ position: 'relative' }}>
              {touched.password && errors.password && (
                <AppLabelFeedbackMsg text={errors.password} />
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
            {/* password */}

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
    gap: 32,
    justifyContent: 'center',
    width: '100%'
  },

  logo: {
    aspectRatio: 1,
    height: 100,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
  }
});
