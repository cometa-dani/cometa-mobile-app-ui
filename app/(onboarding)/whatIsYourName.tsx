import { Image, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import { AppWrapperOnBoarding, onBoardingStyles } from '../../components/onboarding/WrapperOnBoarding';
import { useCometaStore } from '../../store/cometaStore';
import { AppButton } from '../../components/buttons/buttons';
import { AppLabelFeedbackMsg, AppLabelMsgOk, AppTextInput } from '../../components/textInput/AppTextInput';
import { useEffect, useState } from 'react';
import userService from '../../services/userService';
import { If } from '../../components/utils';


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
          name: values.name.trim(),
          username: values.username.trim()
        });
        actions.setSubmitting(false);
        router.push('/(onboarding)/whatIsYourEmail');
      }
      catch (error) {
        // console.log(error);
      }
    };

  // checking if @username is available to used for current user
  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      if (username.length >= 3) {
        try {
          setIsFetching(true);
          const res = await userService.findUniqueByQueryParams({ username: username.trim() });
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
    }, 1_600);

    return () => clearTimeout(timeOutId);
  }, [username]);


  return (
    <AppWrapperOnBoarding>
      {/* logo */}
      <View style={styles.figure}>
        <Image style={onBoardingStyles.logo} source={require('../../assets/images/cometa-logo.png')} />

        <Text size='lg' style={{ textAlign: 'center' }}>What is your name?</Text>
      </View>
      {/* logo */}

      <Formik
        validateOnMount={false}
        initialValues={{ name: '', username: '' }}
        validationSchema={loginSchemma}
        onSubmit={handleNextSlide}
      >
        {({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
          <View style={styles.form}>

            {/* name */}
            <View style={styles.formField}>
              <If
                condition={touched.name && errors.name}
                render={(
                  <AppLabelFeedbackMsg position='bottom' text={errors.name} />
                )}
              />
              <AppTextInput
                iconName='user-o'
                keyboardType="ascii-capable"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                placeholder='Name'
              />
            </View>
            {/* name */}

            {/* @username */}
            <View style={styles.formField}>
              {/* sintactic/local validation */}
              <If
                condition={touched.username && errors.username}
                render={(
                  <AppLabelFeedbackMsg position='bottom' text={errors.username} />
                )}
              />

              {/* validating in the backend */}
              <If
                condition={!isFetching && !errors.username && !isAvaibleToUse}
                render={(
                  <AppLabelFeedbackMsg position='bottom' text={'Your username is already taken'} />
                )}
              />
              <If
                condition={!isFetching && values.username.length >= 3 && !errors.username && isAvaibleToUse}
                render={(
                  <AppLabelMsgOk position='bottom' text={`@${values.username} is available`} />
                )}
              />
              {/* validating in the backend */}
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
    gap: 32,
    justifyContent: 'center',
    position: 'relative',
    width: '100%'
  },

  formField: {
    position: 'relative',
    justifyContent: 'center'
  }
});
