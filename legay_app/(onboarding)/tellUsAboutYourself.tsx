import { Image, StyleSheet } from 'react-native';
import { Text, View } from '../../legacy_components/Themed';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import { AppWrapperOnBoarding, onBoardingStyles } from '../../legacy_components/onboarding/WrapperOnBoarding';
import { AppButton } from '../../legacy_components/buttons/buttons';
import { AppLabelFeedbackMsg, AppTextInput } from '../../legacy_components/textInput/AppTextInput';
import { If } from '../../legacy_components/utils';
import { profileStyles } from '../../legacy_components/profile/profileStyles';
import { gray_300 } from '../../constants/colors';
import { useMutationUpdateUserById, useQueryGetUserProfile } from '../../queries/currentUser/userHooks';
import { useCometaStore } from '../../store/cometaStore';


type ProfileValues = {
  occupation: string,
  biography: string,
}


const validationSchemma = Yup.object<ProfileValues>({
  occupation: Yup.string().min(5).max(32).required(),
  biography: Yup.string().min(5).max(120).optional(),
});


export default function TellUsAboutYourselfScreen(): JSX.Element {
  const uid = useCometaStore(state => state.uid);
  const userProfile = useQueryGetUserProfile(uid); // TODO store loggedIn user in globalState
  const mutateUser = useMutationUpdateUserById();

  const navigate = () => router.push('/(onboarding)/showYourCurrentLocation');

  const handleNextSlide =
    (values: ProfileValues, actions: FormikHelpers<ProfileValues>): void => {
      try {
        if (userProfile.data?.id) {
          mutateUser.mutate({
            userId: userProfile.data?.id,
            payload: {
              occupation: values.occupation,
              biography: values.biography,
            }
          });
          actions.setSubmitting(false);
          navigate();
        }
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

        <Text size='lg' style={{ textAlign: 'center' }}>Tell us about yourself</Text>
      </View>
      {/* logo */}

      <Formik
        enableReinitialize
        validationSchema={validationSchemma}
        initialValues={{
          biography: '',
          occupation: '',
        }}
        onSubmit={handleNextSlide}
      >
        {({ handleBlur, handleChange, handleSubmit, values, touched, errors, dirty }) => (
          <View style={{ ...profileStyles.porfileContent, width: '100%' }}>

            {/* occupation */}
            <View style={{ gap: 8 }}>
              <View style={{ gap: -4 }}>
                <Text style={profileStyles.title}>Occupation</Text>
                <Text style={{ color: gray_300 }}>Write your usual or principal job or profession </Text>
              </View>

              <View style={{ position: 'relative', justifyContent: 'center' }}>
                <If
                  condition={touched.occupation && errors.occupation}
                  render={(
                    <AppLabelFeedbackMsg position='bottom' text={errors.occupation} />
                  )}
                />
                <AppTextInput
                  iconName='briefcase'
                  keyboardType="ascii-capable"
                  onChangeText={handleChange('occupation')}
                  onBlur={handleBlur('occupation')}
                  value={values.occupation}
                />
              </View>
            </View>
            {/* occupation */}


            {/* bio */}
            <View style={{ gap: 8 }}>
              <View style={{ gap: -4 }}>
                <Text style={profileStyles.title}>Bio</Text>
                <Text style={{ color: gray_300 }}>Something fun about yourself and who you are </Text>
              </View>

              <View style={{ position: 'relative', justifyContent: 'center' }}>
                {touched.biography && errors.biography && (
                  <AppLabelFeedbackMsg position='bottom' text={errors.biography} />
                )}
                <AppTextInput
                  iconName='user'
                  keyboardType="ascii-capable"
                  onChangeText={handleChange('biography')}
                  onBlur={handleBlur('biography')}
                  value={values.biography}
                />
              </View>
            </View>
            {/* bio */}


            <View style={{ marginTop: 16 }}>
              <AppButton
                onPress={() => handleSubmit()}
                btnColor='primary'
                text='NEXT'
              />
            </View>
          </View>
        )}
      </Formik>

      <AppButton
        onPress={navigate}
        btnColor='lightGray'
        text='skip this step'
      />

    </AppWrapperOnBoarding>
  );
}

const styles = StyleSheet.create({
  figure: {
    alignItems: 'center',
  }
});
