import { Button, Image, Pressable, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { router } from 'expo-router';
import { AppWrapperOnBoarding } from '../../components/onboarding/WrapperOnBoarding';
import { useCometaStore } from '../../store/cometaStore';
import { AppButton } from '../../components/buttons/buttons';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import Modal from 'react-native-modal';
import { calAge } from '../../helpers/calcAge';
import { AppModal } from '../../components/modal/modal';
// import { BaseButton } from 'react-native-gesture-handler';


const initialDate = new Date('1990');

export default function WhenIsYourBirthdayScreen(): JSX.Element {
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

      {
        toggleDatePicker && (
          <RNDateTimePicker
            value={user?.birthday || initialDate}
            onChange={onChange}
            mode={'date'}
          />
        )
      }

      <AppButton
        onPress={() => setTimeout(() => setToggleDatePicker(prev => !prev), 400)}
        btnColor='white'
        text='PICK DATE'
      />

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
            <Pressable onPress={() => handleEdit()} >
              <Text>Edit</Text>
            </Pressable>
            <Button onPress={() => handleConfirmation()} title='Confirm' />

            {/* 
              <AppButton onPress={() => handleEdit()} btnColor='black' text='Edit' />
              <AppButton onPress={() => handleConfirmation()} btnColor='primary' text='Confirm' /> */}
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
    // alignSelf: 'center',
    borderRadius: 20,
    elevation: 3,
    gap: 20,
    maxWidth: '90%',
    minWidth: 310,
    padding: 24,
    // shadowColor: '#171717',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 0.4,
  }
});
