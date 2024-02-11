import { Image, Platform, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { router } from 'expo-router';
import { AppWrapperOnBoarding, onBoardingStyles } from '../../components/onboarding/WrapperOnBoarding';
import { AppButton } from '../../components/buttons/buttons';
import { AppPhotosGrid } from '../../components/profile/photosGrid';
import { useMutationUploadUserPhotos } from '../../queries/userHooks';
import { Photo } from '../../models/Photo';
import * as ImagePicker from 'expo-image-picker';
import { useCometaStore } from '../../store/cometaStore';
import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import userService from '../../services/userService';
import { auth } from '../../firebase/firebase';
import uuid from 'react-native-uuid';
import { AppLabelFeedbackMsg } from '../../components/textInput/AppTextInput';
import { If } from '../../components/utils';


type UserPhoto = Pick<Photo, 'uuid' | 'url' | 'placeholder'>

const maximumPhotos = 5;


export default function AddPhotosScreen(): JSX.Element {
  const uid = useCometaStore(state => state.uid);
  const onboarding = useCometaStore(state => state.onboarding);
  const setUserUid = useCometaStore(state => state.setUid);
  const setAccessToken = useCometaStore(state => state.setAccessToken);

  // mutations
  const mutateUserPhotosUpload = useMutationUploadUserPhotos(uid);

  // photos presentation
  const [userPhotos, setUserPhotos] = useState<UserPhoto[]>([]);


  const handlePickMultipleImages = async () => {
    if (maximumPhotos === userPhotos.length) {
      return;
    }
    else {
      try {
        const pickedPhotos = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true, // picks multiple images
          selectionLimit: maximumPhotos, // only allows to select a number below the limit
          aspect: [4, 3],
          quality: 1,
        });

        if (!pickedPhotos.canceled) {
          const pickedImgFiles = (
            pickedPhotos.assets?.map((asset) => ({
              url: asset.uri,
              uuid: uuid.v4().toString()
            })) ?? []
          );
          setUserPhotos(prev => prev.concat(pickedImgFiles));
        }
      }
      catch (error) {
        // console.log(error);
      }
    }
  };


  const handleDeleteImage = async (photoUuid: string) => {
    setUserPhotos(prev => prev.filter(excludePhoto));
    const excludePhoto = (photo: UserPhoto): boolean => photo.uuid !== photoUuid;
  };


  const handleNextSlide = async () => {
    if (userPhotos.length === 0) return;
    try {
      const newUser = await handleUserCreation();
      if (!newUser) {
        throw new Error('User not created');
      }
      mutateUserPhotosUpload.mutate({
        userID: newUser?.id,
        pickedImgFiles: userPhotos.map(({ url, uuid }) => ({ uri: url, assetId: uuid }))
      });

      router.push('/(onboarding)/tellUsAboutYourself');
    }
    catch (error) {
      //
    }
  };


  const handleUserCreation = async () => {
    if (onboarding?.user) {
      const { username, email, password, ...otherProperties } = onboarding.user;
      const { data: newCreatedUser } = await userService.create({ username, email }); // first checks if user exists
      try {
        const { user: userCrendentials } = await createUserWithEmailAndPassword(auth, email, password); // firebase
        await userService.updateById(newCreatedUser.id, { ...otherProperties, uid: userCrendentials.uid });
        setUserUid(userCrendentials.uid);
        setAccessToken(await userCrendentials.getIdToken());
        return newCreatedUser;
      }
      catch (error) {
        // console.log(error);
      }
    }
  };


  // prevents back button behavior for android
  useEffect(() => {
    const backAction = () => {
      // You can perform a specific action here, or return true to prevent the default back button behavior
      if (Platform.OS === 'android') {
        return true;
      }
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    // Don't forget to remove the listener when the component is unmounted
    return () => backHandler.remove();
  }, []);


  return (
    <AppWrapperOnBoarding>
      {/* logo */}
      <View style={styles.figure}>
        <Image style={onBoardingStyles.logo} source={require('../../assets/images/cometa-logo.png')} />

        <Text style={onBoardingStyles.title}>Add photos to your profile</Text>
      </View>
      {/* logo */}

      <AppPhotosGrid
        photosList={userPhotos}
        onHandlePickImage={handlePickMultipleImages}
        onDeleteImage={handleDeleteImage}
        placeholders={maximumPhotos - userPhotos.length}
      />

      <If
        condition={userPhotos.length === 0}
        render={(
          <View style={{ marginRight: 'auto' }}>
            <AppLabelFeedbackMsg text='one photo is required' />
          </View>
        )}
      />

      <AppButton
        onPress={handleNextSlide}
        btnColor='primary'
        text='NEXT'
      />
    </AppWrapperOnBoarding>
  );
}

const styles = StyleSheet.create({
  figure: {
    alignItems: 'center',
  }
});
