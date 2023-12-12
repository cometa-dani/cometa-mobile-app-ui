import { Image, Pressable, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { router } from 'expo-router';
import { AppWrapperOnBoarding } from '../../components/onboarding/WrapperOnBoarding';
import { useCometaStore } from '../../store/cometaStore';
import { AppButton, appButtonstyles } from '../../components/buttons/buttons';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { calAge } from '../../helpers/calcAge';
import { AppModal } from '../../components/modal/modal';
import { buttonColors } from '../../constants/colors';


const initialDate = new Date('1990');

export default function WhenIsYourBirthdayScreen(): JSX.Element {
  // const {primary100, } =useColors();
  const setOnboarding = useCometaStore(state => state.setOnboarding);
  const user = useCometaStore(state => state.onboarding.user);
  const [toggleDatePicker, setToggleDatePicker] = useState(false);
  const [isBirthdayConfirmed, setIsBirthdarConfirmed] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);


  const onChange = (event: DateTimePickerEvent, selectedDate?: Date): void => {
    setToggleDatePicker(prev => !prev);

    // when date is set
    if (event.type === 'set') {
      setOnboarding({ birthday: selectedDate });
      console.log(selectedDate);
      setTimeout(() => setToggleModal(true), 300);
    }
  };

  const handleEdit = (): void => {
    setToggleModal(false);
    setTimeout(() => setToggleDatePicker(prev => !prev), 300);
  };

  const handleConfirmation = (): void => {
    if (user.birthday) {
      setIsBirthdarConfirmed(true);
      setToggleModal(false);
    }
  };

  const handleSlideNext = (): void => {
    isBirthdayConfirmed && router.push('/(onboarding)/uploadAvatar');
  };

  return (
    <AppWrapperOnBoarding>
      {/* logo */}
      <View style={styles.figure}>
        <Image style={styles.logo} source={require('../../assets/images/cometa-logo.png')} />

        <Text style={styles.title}>When is your birthday?</Text>
      </View>
      {/* logo */}

      {/* date picker */}
      {toggleDatePicker && (
        <RNDateTimePicker
          value={user?.birthday || initialDate}
          onChange={onChange}
          mode={'date'}
        />
      )}
      {/* date picker */}

      <AppButton
        onPress={() => setTimeout(() => setToggleDatePicker(prev => !prev), 400)}
        btnColor='white'
        text='PICK DATE'
      />

      {!isBirthdayConfirmed && (
        <AppButton
          style={{ position: 'absolute', bottom: 24 }}
          onPress={() => router.push('/(onboarding)/uploadAvatar')}
          btnColor='white'
          text='Skip this step'
        />
      )}

      {isBirthdayConfirmed && (
        <AppButton
          onPress={handleSlideNext}
          btnColor='primary'
          text='NEXT'
        />
      )}

      <AppModal isOpen={toggleModal} setIsOpen={setToggleModal}>
        <View style={modalStyles.modalView}>
          <Text style={{ textAlign: 'center' }}>Confirm your birthday</Text>
          <View>
            <Text style={{ textAlign: 'center' }}>
              {user?.birthday ? calAge(user.birthday) : 0} years old
            </Text>
            <Text style={modalStyles.modalText}>
              {user?.birthday ? user?.birthday?.toDateString() : 'not birthdate selected'}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Pressable
              style={[appButtonstyles.button, { backgroundColor: buttonColors.black.background }]}
              onPress={() => handleEdit()}
            >
              <Text style={appButtonstyles.buttonText}>Edit</Text>
            </Pressable>

            <Pressable
              style={[appButtonstyles.button, { backgroundColor: buttonColors.primary.background }]}
              onPress={() => handleConfirmation()}
            >
              <Text style={appButtonstyles.buttonText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </AppModal>
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
    fontSize: 22,
    fontWeight: 'bold',
  }
});

const modalStyles = StyleSheet.create({
  modalText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

  modalView: {
    borderRadius: 20,
    elevation: 3,
    gap: 20,
    maxWidth: '90%',
    minWidth: 310,
    padding: 24,
  }
});
