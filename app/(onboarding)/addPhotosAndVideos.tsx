import { Image, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { router } from 'expo-router';
import { AppWrapperOnBoarding } from '../../components/onboarding/WrapperOnBoarding';
import { AppButton } from '../../components/buttons/buttons';
import { AppPhotosGrid } from '../../components/profile/photosGrid';
import { useMutationDeleteUserPhotoByUuid, useMutationUploadUserPhotos, useQueryGetUserProfileByUid } from '../../queries/userHooks';
import { Photo } from '../../models/User';
import * as ImagePicker from 'expo-image-picker';
import { useCometaStore } from '../../store/cometaStore';


export default function AddPhotosAndVideosScreen(): JSX.Element {
  const uid = useCometaStore(state => state.uid);
  const setIsAuthenticated = useCometaStore(state => state.setIsAuthenticated);
  // mutations
  const mutateUserPhotosUpload = useMutationUploadUserPhotos();
  const mutateUserPhotosDelete = useMutationDeleteUserPhotoByUuid();

  // queries
  const { data: userProfile } = useQueryGetUserProfileByUid(uid);
  const userPhotos: Photo[] = userProfile?.photos || [];
  const selectionLimit: number = (userProfile?.maxNumPhotos || 5) - (userPhotos?.length || 1);


  const handlePickImage = async () => {
    if (selectionLimit === 0) {
      return;
    }
    else {
      // upload new photos
      try {
        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          selectionLimit, // only allows to select a number below the limit
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.canceled && userProfile?.id) {
          mutateUserPhotosUpload.mutate({
            userID: userProfile?.id,
            pickedImgFiles: result.assets
          });
        }
      }
      catch (error) {
        console.log(error);
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


  return (
    <AppWrapperOnBoarding>
      {/* logo */}
      <View style={styles.figure}>
        <Image style={styles.logo} source={require('../../assets/images/cometa-logo.png')} />

        <Text style={styles.title}>Add photos to your profile</Text>
      </View>
      {/* logo */}

      <AppPhotosGrid
        photosList={userPhotos}
        onHandlePickImage={handlePickImage}
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
