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

// services
import usersService from '../../services/userService';
import { useCometaStore } from '../../store/cometaStore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';


export default function UploadAvatarScreen(): JSX.Element {
  const { text, gray500 } = useColors();
  const [imageUri, setImageUri] = useState<string>('');
  const imgFileRef = useRef<ImagePicker.ImagePickerAsset>();
  const onboarding = useCometaStore(state => state.onboarding);
  const setUserUid = useCometaStore(state => state.setUid);
  const setAccessToken = useCometaStore(state => state.setAccessToken);

  // bio/description
  const bioRef = useRef<TextInput>(null);
  const [biography, setBiography] = useState('Join me');
  const [toggleBio, setToggleBio] = useState(false);


  const handleToggleBio = (): void => {
    if (toggleBio === false) {
      setToggleBio(true);
      setTimeout(() => {
        bioRef.current?.focus();
      }, 200);
    }
    else {
      bioRef.current?.blur();
      setToggleBio(false);
    }
  };


  const handlePickImage = async () => {
    try {
      // No permissions request is necessary for launching the image library
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
  const handleUserRegistration = async () => {
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
            { ...otherUserFields, uid: userCrendentials.uid, biography }
          );
          toggleBio && setToggleBio(false); // just in case is open
          setUserUid(userCrendentials.uid);
          setAccessToken(await userCrendentials.getIdToken());
          router.push('/(onboarding)/addPhotosAndVideos');
        }
        catch (error) {
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
      {/* biography */}

      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ width: 16 }} />

        <View>
          {toggleBio ? (
            <TextInput
              style={{ color: gray500, padding: 0, fontSize: 16 }}
              onChangeText={(text) => setBiography(text)}
              ref={bioRef}
              value={biography}
            />

          ) : (
            <Text style={{ fontSize: 16 }}>{biography}</Text>
          )}
        </View>

        <FontAwesome
          onPress={handleToggleBio}
          style={{ fontSize: 18, top: 5 }}
          name="edit"
        />
      </View>
      {/* biography */}

      <AppButton
        style={{ width: '100%' }}
        onPress={() => handleUserRegistration()}
        text='NEXT'
        btnColor='primary'
      />
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
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase'
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
