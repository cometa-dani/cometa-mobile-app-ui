import { Image, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { router } from 'expo-router';
import { AppWrapperOnBoarding } from '../../components/onboarding/WrapperOnBoarding';
import { useCometaStore } from '../../store/cometaStore';
import { AppButton } from '../../components/buttons/buttons';
import { AppPhotosGrid } from '../../components/profile/photosGrid';


export default function AddPhotosAndVideosScreen(): JSX.Element {
  // const setOnboarding = useCometaStore(state => state.setOnboarding);
  const onboarding = useCometaStore(state => state.onboarding);
  console.log(onboarding);
  // const handleNextSlide =
  //   async (values: UserForm, actions: FormikHelpers<UserForm>) => {
  //     try {
  //       setOnboarding({
  //         name: values.name,
  //         username: values.username
  //       });
  //       actions.resetForm();
  //       actions.setSubmitting(false);
  //       router.push('/(onboarding)/whatIsYourEmail');
  //     }
  //     catch (error) {
  //       console.log(error);
  //     }
  //   };


  return (
    <AppWrapperOnBoarding>
      {/* logo */}
      <View style={styles.figure}>
        <Image style={styles.logo} source={require('../../assets/images/cometa-logo.png')} />

        <Text style={styles.title}>Add photos to your profile</Text>
      </View>
      {/* logo */}

      <AppPhotosGrid photosList={[]} onHandlePickImage={() => { }} placeholders={4} />

      <AppButton
        onPress={() => router.push('/(onboarding)/uploadAvatar')}
        btnColor='primary'
        text='NEXT'
      />
    </AppWrapperOnBoarding>
  );
}

const styles = StyleSheet.create({
  figure: {
    alignItems: 'center',
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
