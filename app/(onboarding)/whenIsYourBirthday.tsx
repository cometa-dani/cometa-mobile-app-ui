import { Image, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { router } from 'expo-router';
import { AppWrapperOnBoarding } from '../../components/onboarding/WrapperOnBoarding';
import { useCometaStore } from '../../store/cometaStore';
import { AppButton } from '../../components/buttons/buttons';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import Modal from 'react-native-modal';


const initialDate = new Date('1990');

export default function WhenIsYourBirthdayScreen(): JSX.Element {
  const setOnboarding = useCometaStore(state => state.setOnboarding);
  const user = useCometaStore(state => state.onboarding.user);
  const [toggleDatePicker, setToggleDatePicker] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);


  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setToggleDatePicker(prev => !prev);
    setOnboarding({ birthday: selectedDate });
    setToggleModal(true);
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

      {/* MOVE TO A PARENT COMPONENT */}
      <Modal isVisible={toggleModal}>
        <View style={modalStyles.modalView}>

          <Text style={modalStyles.modalText}>
            {user?.birthday && new Date(user?.birthday).toLocaleString()}
          </Text>
        </View>

        {/* <Pressable
            style={modalStyles.iconButton}
            onPress={() => setToggleModal()}
          >
            <FontAwesome style={modalStyles.icon} name='times-circle' />
          </Pressable> */}
      </Modal>
      {/* MOVE TO A PARENT COMPONENT */}

      {
        toggleDatePicker && (
          <RNDateTimePicker
            testID="dateTimePicker"
            value={user?.birthday || initialDate}
            onChange={onChange}
            mode={'date'}
          />
        )
      }

      <AppButton
        onPress={() => setToggleDatePicker(prev => !prev)}
        btnColor='white'
        text='PICK DATE'
      />

      <AppButton
        onPress={handleSlideNext}
        btnColor='primary'
        text='NEXT'
      />

    </AppWrapperOnBoarding >
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
    fontSize: 18,
    textAlign: 'center',
  },

  modalView: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 3,
    gap: 16,
    paddingHorizontal: 28,
    paddingVertical: 24,
    shadowColor: '#171717',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 0.4,
    width: '100%'
  }
});
