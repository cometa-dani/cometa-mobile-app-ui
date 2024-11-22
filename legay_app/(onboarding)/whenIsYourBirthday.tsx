import { Image, Pressable, StyleSheet } from 'react-native';
import { Text, View } from '../../legacy_components/Themed';
import { router } from 'expo-router';
import { AppWrapperOnBoarding, onBoardingStyles } from '../../legacy_components/onboarding/WrapperOnBoarding';
import { useCometaStore } from '../../store/cometaStore';
import { AppButton, appButtonstyles } from '../../legacy_components/buttons/buttons';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { calAge } from '../../helpers/calcAge';
import { buttonColors } from '../../constants/colors';
import { If } from '../../legacy_components/utils';
import ReactNativeModal from 'react-native-modal';
import { AppLabelFeedbackMsg } from '../../legacy_components/textInput/AppTextInput';


const initialDate = new Date('1990');

export default function WhenIsYourBirthdayScreen(): JSX.Element {
  const setOnboarding = useCometaStore(state => state.setOnboarding);
  const user = useCometaStore(state => state.onboarding.user);
  const [toggleDatePicker, setToggleDatePicker] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);


  const onChange = (event: DateTimePickerEvent, selectedDate?: Date): void => {
    setToggleDatePicker(prev => !prev);
    // when date is set
    if (event.type === 'set') {
      setOnboarding({ birthday: selectedDate });
      setTimeout(() => setToggleModal(true), 500);
    }
  };

  const handleEdit = (): void => {
    setToggleModal(false);
    setTimeout(() => setToggleDatePicker(prev => !prev), 400);
  };

  const handleConfirmation = (): void => {
    if (user.birthday) {
      setTimeout(() => setToggleModal(false), 400);
    }
  };

  const handleSlideNext = (): void => {
    if (user.birthday) {
      router.push('/(onboarding)/addPhotos');
    }
  };


  const CometaLogo = () => (
    <View style={styles.figure}>
      <Image style={onBoardingStyles.logo} source={require('../../assets/images/cometa-logo.png')} />

      <Text size='lg' style={{ textAlign: 'center' }}>When is your birthday?</Text>
    </View>
  );

  return (
    <AppWrapperOnBoarding>
      <CometaLogo />

      {user.birthday && (
        <View>
          <Text style={{ textAlign: 'center' }}>
            {calAge(user.birthday)} years old
          </Text>
          <Text style={modalStyles.modalText}>
            {user?.birthday?.toDateString()}
          </Text>
        </View>
      )}

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

      <If condition={!user.birthday && !toggleModal}>
        <View style={{ position: 'relative', alignItems: 'center', marginTop: 16 }}>
          <AppLabelFeedbackMsg position='top' text="Mandatory date" />
        </View>
      </If>

      <AppButton
        onPress={handleSlideNext}
        btnColor='primary'
        text='NEXT'
        style={{ width: '100%' }}
      />

      <ReactNativeModal style={{ alignItems: 'center' }} isVisible={toggleModal}>
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
              <Text
                style={[appButtonstyles.buttonText, { color: buttonColors.black.color }]}>
                Edit
              </Text>
            </Pressable>

            <Pressable
              style={[appButtonstyles.button, { backgroundColor: buttonColors.primary.background }]}
              onPress={() => handleConfirmation()}
            >
              <Text
                style={[appButtonstyles.buttonText, { color: buttonColors.primary.color }]}>
                Confirm
              </Text>
            </Pressable>
          </View>
        </View>
      </ReactNativeModal>

    </AppWrapperOnBoarding>
  );
}

const styles = StyleSheet.create({
  figure: {
    alignItems: 'center',
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
