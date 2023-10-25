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


export default function UploadImageScreen(): JSX.Element {
  const { primary100, background, text } = useColors();
  const [imageUri, setImageUri] = useState<string>('');
  const imgFileRef = useRef<ImagePicker.ImagePickerAsset>();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
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

  const handleImageUpload = async () => {
    if (imgFileRef?.current) {
      await usersService.uploadUserImage(1, imgFileRef?.current);
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
        <Image style={styles.avatar} source={{ uri: imageUri }} />

        <View style={styles.form}>
          <Pressable
            onPress={() => pickImage()}
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
            onPress={() => handleImageUpload()}
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
