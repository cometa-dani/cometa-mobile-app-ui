import { Image, Platform, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { router } from 'expo-router';
import { AppWrapperOnBoarding, onBoardingStyles } from '../../components/onboarding/WrapperOnBoarding';
import { AppButton } from '../../components/buttons/buttons';
import { AppPhotosGrid } from '../../components/profile/photosGrid';
import { useMutationDeleteUserPhotoByUuid, useMutationUploadUserPhotos, useQueryGetUserProfileByUid } from '../../queries/userHooks';
import { Photo } from '../../models/Photo';
import * as ImagePicker from 'expo-image-picker';
import { useCometaStore } from '../../store/cometaStore';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';


export default function AddPhotosScreen(): JSX.Element {
  const uid = useCometaStore(state => state.uid);
  const setIsAuthenticated = useCometaStore(state => state.setIsAuthenticated);
  // mutations
  const mutateUserPhotosUpload = useMutationUploadUserPhotos(uid);
  const mutateUserPhotosDelete = useMutationDeleteUserPhotoByUuid(uid);

  // queries
  const { data: userProfile } = useQueryGetUserProfileByUid(uid);
  const userPhotos: Photo[] = userProfile?.photos || [];
  const selectionLimit: number = (userProfile?.maxNumPhotos || 5) - (userPhotos?.length || 0);

  // TODO: bug when uploading multiple images in parts
  const handlePickMultipleImages = async () => {
    if (selectionLimit == 0) {
      return;
    }
    else {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true, // picks multiple images
          selectionLimit, // only allows to select a number below the limit
          aspect: [4, 3],
          quality: 1,
        });
        // console.log(!result.canceled && userProfile?.id);
        if (!result.canceled && userProfile?.id) {
          mutateUserPhotosUpload.mutate({
            userID: userProfile?.id,
            pickedImgFiles: result.assets
          });
        }
      }
      catch (error) {
        // console.log(error);
      }
    }
  };


  const handleDeleteImage = async (photoUuid: string) => {
    mutateUserPhotosDelete.mutate({ userID: userProfile?.id as number, photoUuid });
  };


  const handleNextSlide = (): void => {
    setIsAuthenticated(true);
    router.push('/(app)/');
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
        placeholders={selectionLimit}
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
