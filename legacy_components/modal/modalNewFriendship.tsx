import { FC } from 'react';
// import Modal from 'react-native-modal';
// import { Text, View } from '../Themed';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
// import { Formik, FormikHelpers } from 'formik';
// import uuid from 'react-native-uuid';
import chatWithFriendService from '../../services/chatWithFriendService';
import * as Yup from 'yup';
import { IGetBasicUserProfile, IGetDetailedUserProfile } from '../../models/User';
import { router } from 'expo-router';
import { Pressable, StyleSheet, TextInput } from 'react-native';


type Message = { message: string };

const messageSchemmaValidation = Yup.object<Message>({
  message: Yup.string().required()
});


interface ModalNewFrienshipProps {
  toggle: boolean,
  onclose: () => void,
  loggedInUserProfile?: IGetDetailedUserProfile,
  targetUser?: IGetBasicUserProfile,
  frienshipUUID: string
}
export const ModalNewFriendship: FC<ModalNewFrienshipProps> = ({ onclose, toggle, loggedInUserProfile, targetUser, frienshipUUID }) => {
  /**
   *
   * @description start chat with new friend on modal open
   */
  const handleSentMessageToTargetUserAsNewFriend =
    async (values: Message, actions: FormikHelpers<Message>) => {
      const messagePayload = {
        _id: uuid.v4().toString(),
        text: values.message,
        createdAt: new Date().toString(),
        user: {
          _id: loggedInUserProfile?.uid,
        }
      };
      try {
        if (frienshipUUID && loggedInUserProfile && targetUser) {
          onclose();
          router.push(`/chat/${targetUser?.uid}`);
          await chatWithFriendService.writeMessage(
            frienshipUUID,
            messagePayload,
            loggedInUserProfile,
            targetUser
          );
        }
        actions.resetForm();
        actions.setSubmitting(true);
      }
      catch (error) {
        return null;
      }
    };

  return (
    <Modal isVisible={toggle}>
      <View style={modalStyles.modalView}>
        <View style={modalStyles.avatarMatchContainer}>
          {loggedInUserProfile && (
            <Image
              style={modalStyles.avatarMatch}
              placeholder={{ thumbhash: loggedInUserProfile?.photos[0]?.placeholder ?? '' }}
              source={{ uri: loggedInUserProfile?.photos[0]?.url ?? '' }}
            />
          )
          }
          {targetUser && (
            <Image
              style={modalStyles.avatarMatch}
              placeholder={{ thumbhash: targetUser?.photos?.at(0)?.placeholder ?? '' }}
              source={{ uri: targetUser?.photos?.at(0)?.url ?? '' }}
            />
          )}
        </View>

        <View>
          <Text style={modalStyles.modalText}>It&apos;s a match!</Text>
          <Text style={modalStyles.modalText}>You have a new friend</Text>
        </View>

        <Formik
          validationSchema={messageSchemmaValidation}
          initialValues={{ message: '' }}
          onSubmit={handleSentMessageToTargetUserAsNewFriend}
        >
          {({ handleSubmit, handleBlur, handleChange, values, isSubmitting }) => (
            <View style={modalStyles.inputContainer}>
              <TextInput
                numberOfLines={1}
                style={modalStyles.input}
                onChangeText={handleChange('message')}
                onBlur={handleBlur('message')}
                value={values.message}
                placeholder={`Mesage ${targetUser?.username} to join together`}
              />
              <Pressable
                disabled={isSubmitting}
                style={modalStyles.btnSubmit}
                onPress={() => handleSubmit()}
              >
                <FontAwesome style={{ fontSize: 26, color: '#fff' }} name='send' />
              </Pressable>
            </View>
          )}
        </Formik>

        <Pressable
          style={modalStyles.iconButton}
          onPress={() => onclose()}
        >
          <FontAwesome style={modalStyles.icon} name='times-circle' />
        </Pressable>
      </View>
    </Modal>
  );
};


const modalStyles = StyleSheet.create({
  avatarMatch: {
    aspectRatio: 1,
    borderColor: '#eee',
    borderRadius: 100,
    borderWidth: 2,
    height: 110
  },

  avatarMatchContainer: {
    flexDirection: 'row',
    gap: -28
  },

  btnSubmit: {
    backgroundColor: '#a22bfa',
    borderRadius: 10,
    elevation: 2,
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: '#171717',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },

  icon: {
    fontSize: 34
  },

  iconButton: {
    position: 'absolute',
    right: 28,
    top: 24
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 50,
    elevation: 2,
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#171717',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },

  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    marginTop: 10
  },


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
