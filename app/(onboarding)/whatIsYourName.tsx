import { Image, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import { AppWrapperOnBoarding } from '../../components/onboarding/WrapperOnBoarding';
import { useCometaStore } from '../../store/cometaStore';
import { AppButton } from '../../components/buttons/buttons';
import { AppTextInput } from '../../components/textInput/AppTextInput';
import { useEffect, useState } from 'react';
import userService from '../../services/userService';
import { FontAwesome } from '@expo/vector-icons';


type UserForm = {
  name: string,
  username: string,
}

export const loginSchemma = Yup.object<UserForm>({
  name: Yup.string().min(2).required(),
  username: Yup.string().min(3).required(),
});


export default function WhatIsYourNameScreen(): JSX.Element {
  const setOnboarding = useCometaStore(state => state.setOnboarding);
  const [isAvaibleToUse, setIsAvailableToUse] = useState(true);
  const [username, setUsername] = useState('');

  const handleNextSlide =
    async (values: UserForm, actions: FormikHelpers<UserForm>) => {
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

  useEffect(() => {
    const timoutId = setTimeout(async () => {
      if (username.length >= 3) {
        const res = await userService.getUsersWithFilters({ username });
        console.log(res.status);
        if (res.status === 204) {
          setIsAvailableToUse(true);
        }
        else {
          setIsAvailableToUse(false);
        }
      }
    }, 1_400);

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

      {/* create user with email and password */}
      <Formik
        initialValues={{ name: '', username: '' }}
        validationSchema={loginSchemma}
        onSubmit={handleNextSlide}>

        {({ handleSubmit, handleChange, handleBlur, values, errors, touched, }) => (
          <View style={styles.form}>

            <AppTextInput
              keyboardType="ascii-capable"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              placeholder='Name'
            />

            <View style={styles.formField}>
              {errors.username && (
                <Text style={styles.formLabel}>{errors.username}</Text>
              )}
              {!errors.username && !isAvaibleToUse && (
                <Text style={styles.formLabel}>Your username already exists</Text>
              )}

              <View>
                <View style={{ position: 'absolute', flex: 1, zIndex: 10, alignItems: 'center', height: '100%', justifyContent: 'center', backgroundColor: 'transparent', paddingLeft: 12 }}>
                  <FontAwesome
                    style={styles.formFieldIcon}
                    name='at'
                    size={22}
                  />
                </View>

                <AppTextInput
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
    gap: 34,
    justifyContent: 'center',
    position: 'relative',
    width: '100%'
  },

  formField: {
    position: 'relative',
  },

  formFieldIcon: {
    fontWeight: '900',
    // height: '100%',
    // position: 'absolute',
    // top: '50%',
    zIndex: 10
  },

  formLabel: {
    color: '#bc544c',
    paddingLeft: 20,
    position: 'absolute',
    top: -24
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
