import { Image, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import * as Yup from 'yup';
import { router } from 'expo-router';
import { AppWrapperOnBoarding } from '../../components/onboarding/WrapperOnBoarding';
import { useCometaStore } from '../../store/cometaStore';
import { AppButton } from '../../components/buttons/buttons';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';


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
  const [toggle, setToggle] = useState(false);

  const handleNextSlide = async () => {
    try {
      setToggle(prev => !prev);
      // setOnboarding({
      //   name: values.name,
      //   username: values.username
      // });
      // router.push('/(onboarding)/addPhotosAndVideos');
    }
    catch (error) {
      console.log(error);
    }
  };

  const setDate = (event: DateTimePickerEvent, date: Date) => {
    const {
      type,
      nativeEvent: { timestamp },
    } = event;
  };


  return (
    <AppWrapperOnBoarding>
      {/* logo */}
      <View style={styles.figure}>
        <Image style={styles.logo} source={require('../../assets/images/cometa-logo.png')} />

        <Text style={styles.title}>When is your birthday?</Text>
      </View>
      {/* logo */}

      {toggle && (
        <RNDateTimePicker is24Hour={true} value={new Date()} />
      )}

      <AppButton
        onPress={() => handleNextSlide()}
        btnColor='white'
        text='PICK DATE'
      />
      <AppButton
        onPress={() => router.push('/(onboarding)/addPhotosAndVideos')}
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
