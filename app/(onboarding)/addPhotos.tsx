import { Image, Platform, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { router } from 'expo-router';
import { AppWrapperOnBoarding, onBoardingStyles } from '../../components/onboarding/WrapperOnBoarding';
import { AppButton } from '../../components/buttons/buttons';
import { AppPhotosGrid } from '../../components/profile/photosGrid';
import { useMutationUploadLoggedInUserPhotos } from '../../queries/loggedInUser/userProfileHooks';
import { Photo } from '../../models/Photo';
import * as ImagePicker from 'expo-image-picker';
import { useCometaStore } from '../../store/cometaStore';
import { FC, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import userService from '../../services/userService';
import { auth, firestoreDB } from '../../firebase/firebase';
import uuid from 'react-native-uuid';
import { AppLabelFeedbackMsg } from '../../components/textInput/AppTextInput';
import { If } from '../../components/utils';
import ToastContainer, { Toast } from 'toastify-react-native';
import { doc, setDoc } from 'firebase/firestore';


type UserPhoto = Pick<Photo, 'uuid' | 'url' | 'placeholder'>

const maximumPhotos = 5;


export default function AddPhotosScreen(): JSX.Element {
  const uid = useCometaStore(state => state.uid);
  const onboarding = useCometaStore(state => state.onboarding);
  const setUserUid = useCometaStore(state => state.setUid);
  const setAccessToken = useCometaStore(state => state.setAccessToken);
  const [isLoading, setIsLoading] = useState(false);

  // mutations
  const mutateUserPhotosUpload = useMutationUploadLoggedInUserPhotos(uid);

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
          selectionLimit: maximumPhotos - userPhotos.length, // only allows to select a number below the limit
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
    try {
      setIsLoading(true);
      await handleUserCreation();
      router.push('/(onboarding)/tellUsAboutYourself');
    }
    catch (error) {
      Toast.error('Failed to create 🤯', 'top');
      setTimeout(() => ToastContainer.__singletonRef?.hideToast(), 3_500);
    }
    finally {
      setIsLoading(false);
    }
  };


  const handleUserCreation = async () => {
    if (onboarding?.user && userPhotos.length > 0) {
      try {
        Toast.info('Creating account 🚀', 'top');
        const { email, password } = onboarding.user;
        const { user: userCrendentials } = await createUserWithEmailAndPassword(auth, email, password); // firebase
        const { data: newCreatedUser } = await userService.create({ ...onboarding.user, uid: userCrendentials.uid }); // first checks if user exists
        const { photos } = await mutateUserPhotosUpload.mutateAsync({ userID: newCreatedUser?.id, pickedImgFiles: userPhotos });
        // create user in firebase
        await setDoc(doc(firestoreDB, 'users', userCrendentials.uid), {
          id: newCreatedUser.id,
          uid: newCreatedUser.uid,
          email: newCreatedUser.email,
          name: newCreatedUser.name,
          photo: {
            url: photos[0].url,
            placeholder: photos[0].placeholder
          }
        });
        setUserUid(userCrendentials.uid);
        setAccessToken(await userCrendentials.getIdToken());

        ToastContainer.__singletonRef?.hideToast();
        Toast.success('Account created 🥳', 'top');
        setTimeout(() => ToastContainer.__singletonRef?.hideToast(), 3_500);
      }
      catch (error) {
        // console.log(error);
        Toast.error('Failed to create 🤯', 'top');
        setTimeout(() => ToastContainer.__singletonRef?.hideToast(), 3_500);
      }
    }
  };


  const CometaLogo: FC = () => (
    <View style={styles.figure}>
      <Image style={onBoardingStyles.logo} source={require('../../assets/images/cometa-logo.png')} />

      <Text style={onBoardingStyles.title}>Add photos to your profile</Text>
    </View>
  );


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

      <CometaLogo />

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
        text={isLoading ? 'LOADING...' : 'NEXT'}
        style={{ width: '100%' }}
      />
    </AppWrapperOnBoarding>
  );
}

const styles = StyleSheet.create({
  figure: {
    alignItems: 'center',
  }
});
