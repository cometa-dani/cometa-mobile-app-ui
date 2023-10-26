/* eslint-disable react-native/no-color-literals */
import { Image, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Text, View, useColors } from '../../components/Themed';
import { useRef, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { WrapperOnBoarding } from '../../components/onboarding/WrapperOnBoarding';
import * as ImagePicker from 'expo-image-picker';

// services
import usersService from '../../services/usersService';
import { useCometaStore } from '../../store/cometaStore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { UserRes } from '../../models/User';


export default function UploadImageScreen(): JSX.Element {
  const { primary100, background, text } = useColors();
  const [imageUri, setImageUri] = useState<string>('');
  const imgFileRef = useRef<ImagePicker.ImagePickerAsset>();
  const onboarding = useCometaStore(state => state.onboarding);


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
    const onboardingUser = onboarding?.user as UserRes;
    try {
      const { user: userCredentials } = await createUserWithEmailAndPassword(auth, onboardingUser.email, onboardingUser.password);

      if (imgFileRef?.current?.uri && userCredentials) {
        const payload = {
          username: onboardingUser?.username,
          email: userCredentials.email || '',
          uid: userCredentials?.uid,
        };
        // TODO: try to make this two function calls one.
        try {
          const { data: newCreatedUser } = await usersService.createUser(payload); // save return user in cometaStore
          await usersService.uploadUserImage(newCreatedUser.id, imgFileRef?.current, payload.uid);
        }
        catch (error) {
          console.log(error);
        }
      }
      // await usersService.deleteUser(newCreatedUser.id);
    }
    catch (error) {
      // TODO: handle the case where user already exists
      console.log(error);
    }
  };


  return (
    <WrapperOnBoarding>

      {/* logo */}
      <View style={{ alignItems: 'center' }}>
        <Image style={styles.logo} source={require('../../assets/images/cometa-logo.png')} />

        <Link href={'/(onboarding)/login'}>
          <Text style={styles.title}>Upload your Image</Text>
        </Link>
      </View>
      {/* logo */}

      {/* create user with email and password */}
      <View style={{ alignItems: 'center' }}>
        {imageUri ? (
          <Image style={styles.avatar} source={{ uri: imageUri }} />
        ) : (
          <View style={styles.avatar} />
        )}

        <View style={styles.form}>
          <Pressable
            onPress={() => handlePickImage()}
            style={[{
              backgroundColor: background,
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 10
            },
            styles.button
            ]}>
            <FontAwesome name='upload' size={24} style={{ color: text }} />
            <Text style={[styles.buttonText, { color: text, fontSize: 17 }]}>Pick Image</Text>
          </Pressable>

          <Pressable
            onPress={() => handleUserRegistration()}
            style={[{
              backgroundColor: primary100
            },
            styles.button
            ]}>
            <Text style={styles.buttonText}>Create account</Text>
          </Pressable>

        </View>
      </View>
      {/* create user with email and password */}

    </WrapperOnBoarding>
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

  button: {
    borderRadius: 50,
    elevation: 3,
    paddingHorizontal: 28,
    paddingVertical: 14,
    shadowColor: '#171717',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase'
  },

  form: {
    flexDirection: 'column',
    gap: 26,
    justifyContent: 'center',
    width: '100%'
  },

  logo: {
    aspectRatio: 1,
    height: 100,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  }
});
