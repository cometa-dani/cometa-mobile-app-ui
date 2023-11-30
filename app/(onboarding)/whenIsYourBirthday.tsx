import { Image, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { router } from 'expo-router';
import { AppWrapperOnBoarding } from '../../components/onboarding/WrapperOnBoarding';
import { useCometaStore } from '../../store/cometaStore';
import { AppButton } from '../../components/buttons/buttons';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';



const initialDate = new Date('1990');

export default function WhenIsYourBirthdayScreen(): JSX.Element {
  const setOnboarding = useCometaStore(state => state.setOnboarding);
  const user = useCometaStore(state => state.onboarding.user);
  const [toggle, setToggle] = useState(false);


  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setToggle(prev => !prev);
    setOnboarding({ birthday: selectedDate });
  };


  const handleSlideNext = () => {
    user?.birthday && router.push('/(onboarding)/uploadAvatar');
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
        <RNDateTimePicker
          testID="dateTimePicker"
          value={user?.birthday || initialDate}
          onChange={onChange}
          mode={'date'}
        />
      )}

      <AppButton
        onPress={() => setToggle(prev => !prev)}
        btnColor='white'
        text='PICK DATE'
      />

      <AppButton
        onPress={handleSlideNext}
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
