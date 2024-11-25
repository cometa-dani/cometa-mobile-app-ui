import { FC, useState } from 'react';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { useCometaStore } from '@/store/cometaStore';
import { BottomSheetFlatList as BsFlatList, BottomSheetView as BsView } from '@gorhom/bottom-sheet';
import { Center, HStack, VStack } from '@/components/utils/stacks';
import { Heading } from '@/components/text/heading';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@/components/button/button';


type ImagePickerAsset = ImagePicker.ImagePickerAsset

const MAX_NUMBER_PHOTOS = 7;

type PhotoPlaceholder = {
  position: number;
  asset?: ImagePickerAsset
}
const photosPlaceholder: PhotoPlaceholder[] = [
  {
    position: 0,
    asset: undefined
  },
  {
    position: 1,
    asset: undefined
  },
  {
    position: 2,
    asset: undefined
  },
  {
    position: 3,
    asset: undefined
  },
  {
    position: 4,
    asset: undefined
  },
  {
    position: 5,
    asset: undefined
  },
  {
    position: 6,
    asset: undefined
  }
];

const appendPhoto = (pickedPhotos: ImagePickerAsset[], currentAssets: PhotoPlaceholder[]) => {
  const appendPhoto = (prev: PhotoPlaceholder[]) => {
    let counter = 0;
    return (
      prev.map((photo, index) => {
        const shouldReplace = (index + 1) > (currentAssets.length);
        if (shouldReplace) {
          const newPhoto = {
            ...photo,
            asset: pickedPhotos?.at(counter)
          };
          counter++;
          return newPhoto;
        }
        return photo;
      })
    );
  };
  return appendPhoto;
};

const replacePhoto = (pickedPhotos: ImagePickerAsset[], selectedPosition: number) => {
  const replacePhoto = (prev: PhotoPlaceholder[]) => {
    return prev.map(photo => {
      const isSelected = photo.position === selectedPosition;
      if (isSelected) {
        return {
          ...photo,
          asset: pickedPhotos?.at(0)
        };
      }
      return photo;
    });
  };
  return replacePhoto;
};


interface IProps {
  onNextStep: () => void;
}
export const UploadYouPhotosForm: FC<IProps> = ({ onNextStep }) => {
  const { styles, theme } = useStyles(uploadYourPhotosSheet);
  const setOnboardingState = useCometaStore(state => state.setOnboarding);
  const [userPhotos = [], setUserPhotos] = useState<PhotoPlaceholder[]>(photosPlaceholder);
  const [firstPhoto, ...restPhotos] = userPhotos;

  const handlePickMultipleImages = async (selectedPosition = 0) => {
    const currentAssets = userPhotos.filter(photo => photo?.asset); // filter out the already exisisting images
    const isGridFull = MAX_NUMBER_PHOTOS === currentAssets.length;
    try {
      const takePhotos: number = MAX_NUMBER_PHOTOS - currentAssets.length; // take a number below the limit
      const pickedPhotos = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true, // picks multiple images
        selectionLimit: isGridFull ? 1 : takePhotos,
        aspect: [4, 3],
        quality: 1,
      });
      if (!pickedPhotos.canceled) {
        if (isGridFull) {
          setUserPhotos(replacePhoto(pickedPhotos.assets, selectedPosition));
        }
        else {
          setUserPhotos(appendPhoto(pickedPhotos.assets, currentAssets));
        }
      }
    }
    catch (error) {
      return null;
    }
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

        <VStack gap={theme.spacing.sp2}>
          <Pressable
            onPress={() => handlePickMultipleImages()}
            style={({ pressed }) => styles.mainImageViewer(pressed, !firstPhoto?.asset)}
          >
            {firstPhoto?.asset ? (
              <Image
                style={styles.mainImage}
                source={{ uri: firstPhoto.asset?.uri }}
                contentFit='cover'
              />
            ) : (
              <FontAwesome6 name="add" size={theme.icons.md} color={theme.colors.gray300} />
            )}
            <View style={styles.imageNum}>
              <Text style={styles.imageNumText}>{1}</Text>
            </View>
          </Pressable>

          <BsFlatList
            data={restPhotos} // replace with your actual data
            numColumns={3}
            columnWrapperStyle={{ gap: theme.spacing.sp2 }}
            contentContainerStyle={{ gap: theme.spacing.sp2 }}
            renderItem={({ item, index }) => {
              return (
                <Pressable
                  onPress={() => handlePickMultipleImages(item.position)}
                  style={({ pressed }) => styles.imageViewer(pressed, !item?.asset)}
                >
                  {item.asset ? (
                    <Image
                      style={styles.image}
                      source={{ uri: item.asset?.uri }}
                      contentFit='cover'
                    />
                  ) : (
                    <FontAwesome6 name="add" size={theme.icons.md} color={theme.colors.gray300} />
                  )}
                  <View style={styles.imageNum}>
                    <Text style={styles.imageNumText}>{index + 2}</Text>
                  </View>
                </Pressable>
              );
            }}
            keyExtractor={(_, index) => index.toString()}
          />
        </VStack>

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
            Add at least 4 photos
          </Text>
        </HStack>

        <View style={{ paddingBottom: UnistylesRuntime.insets.bottom }}>
          <Button variant='primary' onPressed={onNextStep}>
            Next
          </Button>
        </View>
      </BsView>
    </>
  );
};


const uploadYourPhotosSheet = createStyleSheet((theme) => ({
  mainImage: {
    flex: 1,
    aspectRatio: 2.4,
    borderRadius: theme.radius.sm,
  },
  image: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: theme.radius.sm,
  },
  mainImageViewer: (isPressed: boolean, showBorder = true) => ({
    position: 'relative',
    aspectRatio: 2.4,
    borderWidth: showBorder ? 2 : undefined,
    backgroundColor: isPressed ? theme.colors.white80 : theme.colors.white100,
    borderColor: theme.colors.gray100,
    borderStyle: 'dashed',
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  imageViewer: (isPressed: boolean, showBorder = true) => ({
    position: 'relative',
    flex: 1,
    aspectRatio: 1.05,
    borderWidth: showBorder ? 2 : undefined,
    backgroundColor: isPressed ? theme.colors.white80 : theme.colors.white100,
    borderColor: theme.colors.gray100,
    borderStyle: 'dashed',
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  imageNum: {
    position: 'absolute',
    zIndex: 10,
    top: 7,
    right: 7,
    backgroundColor: theme.colors.white70,
    shadowColor: theme.colors.gray900,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    borderRadius: 9999,
    width: theme.spacing.sp7,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageNumText: {
    color: theme.colors.gray900,
    fontFamily: theme.text.fontSemibold,
    fontSize: theme.text.size.s2
  }
}));
