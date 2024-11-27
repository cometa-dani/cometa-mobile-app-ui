import { FC } from 'react';
import { useStyles } from 'react-native-unistyles';
import { useCometaStore } from '@/store/cometaStore';
import { BottomSheetView as BsView, TouchableOpacity } from '@gorhom/bottom-sheet';
import { Center, HStack } from '@/components/utils/stacks';
import { Heading } from '@/components/text/heading';
import { Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { buttonsStyleSheet } from '@/components/button/button';
import { createEmptyPlaceholders, hasAsset, IPhotoPlaceholder, PhotosGrid } from '../photosGrid/photosGrid';
import { MAX_NUMBER_PHOTOS, MIN_NUMBER_PHOTOS } from '@/constants/vars';


const setInitialPlaceholders = () => createEmptyPlaceholders(MAX_NUMBER_PHOTOS);

interface IProps {
  onNextStep: () => void;
}
export const UploadYouPhotosForm: FC<IProps> = ({ onNextStep }) => {
  const { theme } = useStyles();
  const setOnboardingState = useCometaStore(state => state.setOnboarding);
  const userPhotos = useCometaStore(state => state.onboarding.user.photos) ?? [];
  const { styles: buttonsStyles } = useStyles(buttonsStyleSheet, {
    color: 'primary'
  });

  const handleUserState = (photos: IPhotoPlaceholder[]) => {
    const filteredPhotos = photos.filter(hasAsset);
    console.log('handlePhotosUpload', filteredPhotos);
    setOnboardingState({ photos: filteredPhotos });
  };

  const handleNextStep = () => {
    if (userPhotos.filter(hasAsset).length < MIN_NUMBER_PHOTOS) return;
    onNextStep();
  };

  return (
    <>
      <BsView>
        <Center styles={{
          paddingTop: theme.spacing.sp12,
          paddingBottom: theme.spacing.sp2
        }}>
          <Heading size='s7'>Upload your Photos</Heading>
        </Center>
      </BsView>
      <BsView
        style={{
          paddingVertical: theme.spacing.sp8,
          paddingHorizontal: theme.spacing.sp10,
          gap: theme.spacing.sp12
        }}>

        <PhotosGrid
          action='create'
          setInitialPhotos={setInitialPlaceholders}
          onSelect={handleUserState}
        />

        <HStack
          $y='center'
          $x='center'
          gap={theme.spacing.sp1}
          styles={{
            paddingLeft: theme.spacing.sp8
          }}
        >
          <AntDesign
            name={'exclamationcircleo'}
            size={theme.icons.xs}
            color={theme.colors.blue100}
          />
          <Text style={{ color: theme.colors.blue100 }}>
            Add at least {MIN_NUMBER_PHOTOS} photos
          </Text>
        </HStack>

        <TouchableOpacity
          style={buttonsStyles.buttonContainer()}
          onPress={handleNextStep}
        >
          <Text style={buttonsStyles.buttonText()}>Next</Text>
        </TouchableOpacity>
      </BsView>
    </>
  );
};
