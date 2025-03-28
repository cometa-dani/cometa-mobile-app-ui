import { Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Text, View, useColors } from '../../components/Themed';
import { useRef, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { AppWrapperOnBoarding } from '../../components/onboarding/WrapperOnBoarding';
import { AppButton } from '../../components/buttons/buttons';
import * as ImagePicker from 'expo-image-picker';
import { UserClientState } from '../../models/User';
import { TextInput } from 'react-native-gesture-handler';
import { Formik, FormikHelpers } from 'formik';
import { AppInputFeedbackMsg } from '../../components/textInput/AppTextInput';
import * as Yup from 'yup';

// services
import usersService from '../../services/userService';
import { useCometaStore } from '../../store/cometaStore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';


const validationSchemma = Yup.object({
  bio: Yup.string().min(5).max(32).required()
});

export default function UploadAvatarScreen(): JSX.Element {
  const { text, gray500 } = useColors();
  const [imageUri, setImageUri] = useState<string>('');
  const imgFileRef = useRef<ImagePicker.ImagePickerAsset>();
  const onboarding = useCometaStore(state => state.onboarding);
  const setUserUid = useCometaStore(state => state.setUid);
  const setAccessToken = useCometaStore(state => state.setAccessToken);

  // bio/description
  const bioRef = useRef<TextInput>(null);
  const [toggleBio, setToggleBio] = useState(false);


  const handleToggleBioInput = (): void => {
    if (toggleBio === false) {
      setToggleBio(true); // opens input
      setTimeout(() => {
        bioRef.current?.focus();
      }, 200);
    }
    else {
      bioRef.current?.blur();
      setToggleBio(false); // closes input
    }
  };


  // No permissions request is necessary for launching the image library
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        imgFileRef.current = result.assets[0];
        setImageUri(result.assets[0].uri);
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  // TODO: verify that username & phone & email are unique and do not exist already
  const handleUserRegistrationAndSlideNext =
    async (values: { bio: string }, actions: FormikHelpers<{ bio: string }>) => {
      const { username, email, password, ...otherUserFields } = onboarding?.user as UserClientState;
      try {
        if (imgFileRef?.current?.uri) {
          // put this step on the register form
          const { data: newCreatedUser } = await usersService.create({ username, email }); // first checks if user exists
          try {
            const [{ user: userCrendentials }] = (
              await Promise.all([
                createUserWithEmailAndPassword(auth, email, password),
                usersService.uploadOrUpdateAvatarImgByUserID(newCreatedUser.id, imgFileRef?.current),
              ])
            );
            await usersService.updateById(
              newCreatedUser.id,
              { ...otherUserFields, uid: userCrendentials.uid, biography: values.bio }
            );
            toggleBio && setToggleBio(false); // just in case is open
            setUserUid(userCrendentials.uid);
            setAccessToken(await userCrendentials.getIdToken());
            actions.setSubmitting(false);
            router.push('/(onboarding)/addPhotosAndVideos');
          }
          catch (error) {

            // TODO: delete user from DB and firebase
            console.log(error);
          }
        }
        else {
          throw new Error('image not provided');
        }
      }
      catch (error) {
        console.log(error); // triggers when user already exists
      }
    };


  return (
    <AppWrapperOnBoarding>
      {/* logo */}
      <View style={{ alignItems: 'center' }}>
        <Image style={styles.logo} source={require('../../assets/images/cometa-logo.png')} />
        <Text style={styles.title}>Upload your Image</Text>
      </View>
      {/* logo */}

      <View style={{ alignItems: 'center' }}>
        {imageUri ? (
          <Image style={styles.avatar} source={{ uri: imageUri }} />
        ) : (
          <View style={styles.avatar} />
        )}

        <View style={styles.btnsContainer}>
          <AppButton
            btnColor='white'
            onPress={() => handlePickImage()}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <FontAwesome name='upload' size={22} style={{ color: text }} />
              <Text style={[styles.buttonText, { color: text }]}>Pick Image</Text>
            </View>
          </AppButton>
        </View>
      </View>

      <Formik
        validationSchema={validationSchemma}
        initialValues={{ bio: 'Tell me something about you' }}
        onSubmit={handleUserRegistrationAndSlideNext}
      >
        {({ handleBlur, handleChange, handleSubmit, values, errors }) => (
          <>
            {/* biography */}
            <View style={{ position: 'relative', width: '100%' }}>
              {errors.bio && (
                <AppInputFeedbackMsg text={errors.bio} />
              )}
              <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: 16 }} />

                <View>
                  {toggleBio ? (
                    <TextInput
                      style={{
                        color: gray500,
                        padding: 0,
                        fontSize: 16,
                        textAlign: 'center',
                        flexGrow: 1,
                        width: '100%'
                      }}
                      onBlur={handleBlur('bio')}
                      onChangeText={handleChange('bio')}
                      ref={bioRef}
                      value={values.bio}
                    />
                  ) : (
                    <Text style={{ fontSize: 16, textAlign: 'center' }}>{values.bio}</Text>
                  )}
                </View>

                <FontAwesome
                  onPress={handleToggleBioInput}
                  style={{ fontSize: 18, top: 5 }}
                  name="edit"
                />
              </View>
            </View>
            {/* biography */}

            <AppButton
              style={{ width: '100%' }}
              onPress={() => handleSubmit()}
              text='NEXT'
              btnColor='primary'
            />
          </>
        )}
      </Formik>

    </AppWrapperOnBoarding>
  );
}


const styles = StyleSheet.create({
  avatar: {
    aspectRatio: 1,
    backgroundColor: '#eee',
    borderRadius: 100,
    height: 160,
    marginBottom: 20
  },

  btnsContainer: {
    flexDirection: 'column',
    gap: 26,
    justifyContent: 'center',
    width: '100%'
  },

  buttonText: {
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase'
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
