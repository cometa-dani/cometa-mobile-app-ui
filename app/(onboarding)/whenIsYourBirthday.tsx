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
  name: string,
  username: string,
}

export const loginSchemma = Yup.object<UserForm>({
  name: Yup.string().min(2).required(),
  username: Yup.string().min(2).required(),
});


export default function WhenIsYourBirthdayScreen(): JSX.Element {
  const setOnboarding = useCometaStore(state => state.setOnboarding);

  const handleNextSlide =
    async (values: UserForm, actions: FormikHelpers<UserForm>) => {
      try {
        setOnboarding({
          name: values.name,
          username: values.username
        });
        actions.resetForm();
        actions.setSubmitting(false);
        router.push('/(onboarding)/addPhotosAndVideos');
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

        <Text style={styles.title}>What is your name?</Text>
      </View>
      {/* logo */}

      {/* create user with email and password */}
      <Formik
        initialValues={{ name: '', username: '' }}
        validationSchema={loginSchemma}
        onSubmit={handleNextSlide}>

        {({ handleSubmit, handleChange, handleBlur, values }) => (
          <View style={styles.form}>

            <AppTextInput
              keyboardType="ascii-capable"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              placeholder='Name'
            />

            <AppTextInput
              keyboardType="ascii-capable"
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
              placeholder='Username'
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
