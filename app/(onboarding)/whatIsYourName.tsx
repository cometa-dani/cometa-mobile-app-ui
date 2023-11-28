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
  name: string,
  username: string,
}

export const loginSchemma = Yup.object<UserForm>({
  name: Yup.string().min(3).max(26).required(),
  username: Yup.string().min(3).max(18).required(),
});


export default function WhatIsYourNameScreen(): JSX.Element {
  const setOnboarding = useCometaStore(state => state.setOnboarding);
  const [isAvaibleToUse, setIsAvailableToUse] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [username, setUsername] = useState('');

  const handleNextSlide =
    (values: UserForm, actions: FormikHelpers<UserForm>): void => {
      if (!isAvaibleToUse || isFetching) return;
      try {
        setOnboarding({
          name: values.name,
          username: values.username
        });
        actions.resetForm();
        actions.setSubmitting(false);
        router.push('/(onboarding)/whatIsYourEmail');
      }
      catch (error) {
        console.log(error);
      }
    };

  // checking if @username is available to used for current user
  useEffect(() => {
    const timoutId = setTimeout(async () => {
      if (username.length >= 3) {
        try {
          setIsFetching(true);
          const res = await userService.getUsersWithFilters({ username });
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
  }, [username]);


  return (
    <AppWrapperOnBoarding>
      {/* logo */}
      <View style={styles.figure}>
        <Image style={styles.logo} source={require('../../assets/images/cometa-logo.png')} />

        <Text style={styles.title}>What is your name?</Text>
      </View>
      {/* logo */}

      <Formik
        initialValues={{ name: '', username: '' }}
        validationSchema={loginSchemma}
        onSubmit={handleNextSlide}
      >
        {({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
          <View style={styles.form}>

            {/* names */}
            <View style={styles.formField}>
              {touched.name && errors.name && (
                <AppInputFeedbackMsg text={errors.name} />
              )}
              <AppTextInput
                iconName='user-o'
                keyboardType="ascii-capable"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                placeholder='Names'
              />
            </View>
            {/* name */}

            {/* @username */}
            <View style={styles.formField}>
              {touched.username && errors.username && (
                <AppInputFeedbackMsg text={errors.username} />
              )}
              {!errors.username && !isAvaibleToUse && (
                <AppInputFeedbackMsg text='Your username is already taken' />
              )}

              <AppTextInput
                iconName='at'
                keyboardType="ascii-capable"
                onChangeText={(text) => {
                  handleChange('username')(text);
                  setUsername(text);
                }}
                onBlur={handleBlur('username')}
                value={values.username}
                placeholder='Username'
              />
            </View>
            {/* @username */}

            <AppButton
              onPress={() => handleSubmit()}
              btnColor='primary'
              text='NEXT'
            />
          </View>
        )}
      </Formik>
    </AppWrapperOnBoarding>
  );
}


const styles = StyleSheet.create({
  figure: {
    alignItems: 'center',
  },

  form: {
    flexDirection: 'column',
    gap: 34,
    justifyContent: 'center',
    position: 'relative',
    width: '100%'
  },

  formField: {
    position: 'relative',
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
