import { FC } from 'react';
import { useStyles } from 'react-native-unistyles';
import { useCometaStore } from '@/store/cometaStore';
import { HStack } from '@/components/utils/stacks';
import { Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { createEmptyPlaceholders, hasAsset, IPhotoPlaceholder, PhotosGrid } from '../photosGrid/photosGrid';
import { MAX_NUMBER_PHOTOS, MIN_NUMBER_PHOTOS } from '@/constants/vars';
import { FooterButton } from './components/footerButton';
import { IProps } from './components/interface';


const setInitialPlaceholders = () => createEmptyPlaceholders(MAX_NUMBER_PHOTOS);

export const UploadYouPhotosForm: FC<IProps> = ({ activatePage, onNext }) => {
  const { theme } = useStyles();
  const setOnboardingState = useCometaStore(state => state.setOnboarding);
  const userPhotos = useCometaStore(state => state.onboarding.user.photos) ?? [];

  const handleUserState = (photos: IPhotoPlaceholder[]) => {
    const filteredPhotos = photos.filter(hasAsset);
    setOnboardingState({ photos: filteredPhotos });
  };

  const handleNextStep = () => {
    if (userPhotos.filter(hasAsset).length < MIN_NUMBER_PHOTOS) return;
    onNext();
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <View
        style={{
          flex: 1,
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
      </View>

      <FooterButton
        text='Next'
        onNext={handleNextStep}
      />
    </View>
  );
};
