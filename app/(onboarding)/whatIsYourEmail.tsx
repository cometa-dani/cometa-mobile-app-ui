import { Image, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import { AppWrapperOnBoarding, onBoardingStyles } from '../../components/onboarding/WrapperOnBoarding';
import { useCometaStore } from '../../store/cometaStore';
import { AppButton } from '../../components/buttons/buttons';
import { AppLabelFeedbackMsg, AppLabelMsgOk, AppTextInput } from '../../components/textInput/AppTextInput';
import { FC, useEffect, useState } from 'react';
import userService from '../../services/userService';


type UserForm = {
  email: string,
}

export const loginSchemma = Yup.object<UserForm>({
  email: Yup.string().email().required(),
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
          email: values.email.trim(),
        });
        actions.setSubmitting(false);
        router.push('/(onboarding)/whatIsYourPassword');
      }
      catch (error) {
        // console.log(error);
      }
    };


  // check if user exists in our DB
  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      if (email.includes('@')) {
        try {
          setIsFetching(true);
          const res = await userService.findUniqueByQueryParams({ email: email.trim() });
          if (res.status === 204) {
            setIsAvailableToUse(true);
          }
          else {
            setIsAvailableToUse(false);
          }
        }
        catch (error) {
          //
        }
        finally {
          setIsFetching(false);
        }
      }
    }, 2_000);

    return () => clearTimeout(timeOutId);
  }, [email]);


  const CometaLogo: FC = () => (
    <View style={styles.figure}>
      <Image style={onBoardingStyles.logo} source={require('../../assets/images/cometa-logo.png')} />

      <Text style={onBoardingStyles.title}>What is your email?</Text>
    </View>
  );


  return (
    <AppWrapperOnBoarding>

      <CometaLogo />

      <Formik
        initialValues={{ email: onboarding.email || '' }}
        validationSchema={loginSchemma}
        onSubmit={handleNextSlide}
      >
        {({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
          <View style={styles.form}>

            <View style={{ position: 'relative', justifyContent: 'center' }}>
              {touched.email && errors.email && (
                <AppLabelFeedbackMsg position='bottom' text={errors.email} />
              )}
              {!isFetching && values.email.includes('@') && !errors.email && !isAvaibleToUse && (
                <AppLabelFeedbackMsg position='bottom' text='your email already exists' />
              )}
              {!isFetching && values.email.includes('@') && !errors.email && isAvaibleToUse && (
                <AppLabelMsgOk position='bottom' text='email is available' />
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
    gap: 32,
    justifyContent: 'center',
    width: '100%'
  }
});
