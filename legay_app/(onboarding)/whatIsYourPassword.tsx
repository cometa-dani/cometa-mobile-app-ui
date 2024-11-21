import { Image, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import { AppWrapperOnBoarding, onBoardingStyles } from '../../components/onboarding/WrapperOnBoarding';
import { useCometaStore } from '../../store/cometaStore';
import { AppButton } from '../../components/buttons/buttons';
import { AppLabelFeedbackMsg, AppLabelMsgOk, AppTextInput } from '../../components/textInput/AppTextInput';
import { If } from '../../components/utils';


type UserForm = {
  password: string,
  repeatPassword: string,
}

export const loginSchemma = Yup.object<UserForm>({
  password: Yup.string().min(6).max(18).required(),
  repeatPassword:
    Yup.string()
      .oneOf([Yup.ref('password'), ''], 'passwords must match')
      .required(),
});


export default function WhatIsYourPasswordScreen(): JSX.Element {
  const setOnboarding = useCometaStore(state => state.setOnboarding);
  const onboarding = useCometaStore(state => state.onboarding.user);

  const handleNextSlide =
    (values: UserForm, actions: FormikHelpers<UserForm>): void => {

      if (values.password.trim() !== values.repeatPassword.trim()) return;
      try {
        setOnboarding({
          password: values.password.trim(),
        });
        actions.setSubmitting(false);
        router.push('/(onboarding)/whenIsYourBirthday');
      }
      catch (error) {
        // console.log(error);
      }
    };


  return (
    <AppWrapperOnBoarding>
      {/* logo */}
      <View style={styles.figure}>
        <Image style={onBoardingStyles.logo} source={require('../../assets/images/cometa-logo.png')} />

        <Text size='lg' style={{ textAlign: 'center' }}>What is your password?</Text>
      </View>
      {/* logo */}

      <Formik
        initialValues={{ password: onboarding.password ?? '', repeatPassword: onboarding.password ?? '' }}
        validationSchema={loginSchemma}
        onSubmit={handleNextSlide}
      >
        {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isValid, dirty }) => (
          <View style={styles.form}>

            {/* password */}
            <View style={{ position: 'relative', justifyContent: 'center' }}>
              <If
                condition={touched.password && errors.password}
                render={(
                  <AppLabelFeedbackMsg position='bottom' text={errors.password} />
                )}
              />
              <If
                condition={!errors.password && errors.repeatPassword === 'passwords must match'}
                render={(
                  <AppLabelFeedbackMsg position='bottom' text={errors.repeatPassword} />
                )}
              />
              <If
                condition={touched.password && !errors.password && values.password === values.repeatPassword}
                render={(
                  <AppLabelMsgOk text='' position='bottom' />
                )}
              />
              <AppTextInput
                iconName='lock'
                keyboardType="ascii-capable"
                secureTextEntry={true}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                placeholder='Password'
              />
            </View>
            {/* password */}

            <View style={{ gap: 12 }}>
              <Text style={{ fontWeight: '700', marginLeft: 20 }}>Repeat password</Text>

              {/* repeat password */}
              <View style={{ position: 'relative', justifyContent: 'center' }}>
                <If
                  condition={touched.repeatPassword && errors.repeatPassword}
                  render={(
                    <AppLabelFeedbackMsg position='bottom' text={errors.repeatPassword} />
                  )}
                />
                <If
                  condition={touched.repeatPassword && !errors.repeatPassword && values.password === values.repeatPassword}
                  render={(
                    <AppLabelMsgOk text='' position='bottom' />
                  )}
                />
                <AppTextInput
                  iconName='lock'
                  keyboardType="ascii-capable"
                  secureTextEntry={true}
                  onChangeText={handleChange('repeatPassword')}
                  onBlur={handleBlur('repeatPassword')}
                  value={values.repeatPassword}
                  placeholder='Password'
                />
              </View>
              {/* repeat password */}
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
    gap: 32,
    justifyContent: 'center',
    width: '100%'
  }
});
