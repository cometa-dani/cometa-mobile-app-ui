import { VStack } from '@/components/utils/stacks';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { FC, useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Condition } from '@/components/utils/ifElse';
import { ForEach } from '@/components/utils/ForEach';
import { imageTransition, MAX_NUMBER_PHOTOS } from '@/constants/vars';
import { Notifier } from 'react-native-notifier';
import { ErrorToast } from '@/components/toastNotification/toastNotification';
import { IPhoto } from '@/models/Photo';


type ImagePickerAsset = ImagePicker.ImagePickerAsset


export type IPhotoPlaceholder = {
  position: number;
  /**
   *
   * @description picked up photo from the phone's file system
   */
  fromFileSystem?: ImagePickerAsset,
  /**
   *
   * @description saved photo in the backend
   */
  fromBackend?: IPhoto
}

export const createPlaceholders = (MAX_NUMBER: number, usersPhotos: IPhoto[] = []): IPhotoPlaceholder[] => {
  const fullPlaceholders = usersPhotos.map((fromBackend, index) => ({
    position: index,
    fromFileSystem: undefined,
    fromBackend
  }));
  const remainingPlaceholders = MAX_NUMBER - usersPhotos.length;
  if (remainingPlaceholders < 0) throw new Error('Not enough placeholders');
  const emptyPlaceholders = (
    Array
      .from({ length: remainingPlaceholders })
      .map((_, index) => ({
        position: fullPlaceholders.length + index,
        fromFileSystem: undefined,
        fromBackend: undefined
      }))
  );
  return [...fullPlaceholders, ...emptyPlaceholders];
};


/**
 *
 * @description Generates a 2D array from a 1D array
 */
function generate2DArray<T>(arr: T[], numberOfColumns: number = 3): T[][] {
  const _2DArr: T[][] = [];
  arr.forEach((photo, index) => {
    if (index % numberOfColumns === 0) {
      _2DArr.push([photo]);
    }
    else {
      _2DArr.at(-1)?.push(photo);
    }
  });
  return _2DArr;
}


export const isFromFileSystem = (photo: IPhotoPlaceholder) => photo?.fromFileSystem;
export const isTaken = (photo: IPhotoPlaceholder) => photo?.fromFileSystem || photo?.fromBackend;


const appendPhoto = (pickedPhotos: ImagePickerAsset[]) => {
  const appendPhoto = (prev: IPhotoPlaceholder[]): IPhotoPlaceholder[] => {
    let counter = 0;
    const currentAssets = prev.filter(isFromFileSystem);
    return (
      prev.map((photo, index) => {
        const shouldReplace = (index + 1) > (currentAssets.length);
        if (shouldReplace) {
          const newPhoto = {
            ...photo,
            fromFileSystem: pickedPhotos?.at(counter)
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
  const replacePhoto = (prev: IPhotoPlaceholder[]): IPhotoPlaceholder[] => {
    return prev.map(photo => {
      const isSelected = photo.position === selectedPosition;
      if (isSelected) {
        return {
          ...photo,
          fromFileSystem: pickedPhotos?.at(0)
        };
      }
      return photo;
    });
  };
  return replacePhoto;
};


interface IPhotosGridProps {
  /**
   *
   * @description if acttion is 'update' returns 1 photo, if 'create' returns all photos
   */
  onSelect: (photos: IPhotoPlaceholder[]) => void
  initialPhotos?: IPhoto[],
  mode?: 'create' | 'update',
}
export const PhotosGrid2: FC<IPhotosGridProps> = ({ initialPhotos = [], onSelect, mode = 'create' }) => {
  const { styles, theme } = useStyles(uploadYourPhotosSheet);
  const [userPhotos = [], setUserPhotos] = useState<IPhotoPlaceholder[]>(createPlaceholders(MAX_NUMBER_PHOTOS, initialPhotos));
  const [firstPhoto, ...restPhotos] = userPhotos;

  const handlePickMultipleImages = async (selectedPosition = 0, isPositionEmpty = false) => {
    const takenPlaceholders = userPhotos.filter(isTaken); // photos that have been taken
    const remainingPhotos: number = MAX_NUMBER_PHOTOS - takenPlaceholders.length; // take a number below the limit
    try {
      const pickedPhotos = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: !isPositionEmpty, // picks multiple images
        allowsEditing: !isPositionEmpty,
        selectionLimit: remainingPhotos === 0 ? 1 : remainingPhotos,
        aspect: [4, 3],
        quality: 1,
      });
      if (!pickedPhotos.canceled) {
        console.log(pickedPhotos.assets[0].uri);
        const newPhotos = (
          isPositionEmpty ?
            replacePhoto(pickedPhotos.assets, selectedPosition)(userPhotos)
            : appendPhoto(pickedPhotos.assets)(userPhotos)
        );
        setUserPhotos(newPhotos); // update the grid's state
        if (mode === 'create') {
          onSelect(newPhotos); // lift up all the new photos
        }
        if (mode === 'update') {
          if (isPositionEmpty) {
            onSelect(newPhotos.filter(isFromFileSystem)); // lifts state up
          } else {
            onSelect([{  // one to one lifts state up
              position: selectedPosition,
              fromFileSystem: pickedPhotos.assets[0],
              fromBackend: userPhotos.at(selectedPosition)?.fromBackend
            }]);
          }
        }
      }
    }
    catch (error) {
      Notifier.showNotification({
        title: 'Error',
        description: 'the image could not be loaded',
        Component: ErrorToast
      });
    }
  };

  const Grid: FC = useCallback(() => (
    <ForEach items={generate2DArray(restPhotos)}>
      {(row, i = 0, arr = []) => (
        <View key={i} style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap', gap: theme.spacing.sp2 }}>
          <ForEach items={row}>
            {(cell, j = 0) => {
              const placeholder = cell?.fromBackend?.placeholder;
              const source = cell?.fromFileSystem?.uri ?? cell?.fromBackend?.url;
              return (
                <Pressable
                  key={j}
                  style={({ pressed }) => styles.imageViewer(pressed, !source)}
                  onPress={() => handlePickMultipleImages(cell.position, !!source)}
                >
                  <Condition
                    if={source}
                    then={
                      <Image
                        recyclingKey={source}
                        source={{ uri: source, placeholder }}
                        style={styles.image}
                        contentFit='cover'
                        transition={imageTransition}
                      />
                    }
                    else={<FontAwesome6 name="add" size={theme.icons.md} color={theme.colors.gray300} />}
                  />
                  <View style={styles.imageNum}>
                    <Text style={styles.imageNumText}>{j + (i * arr?.length) + 2}</Text>
                  </View>
                </Pressable>
              );
            }}
          </ForEach>
        </View>
      )}
    </ForEach>
  ), [restPhotos]);

  const FirstPhoto: FC = useCallback(() => {
    const source = firstPhoto?.fromFileSystem?.uri ?? firstPhoto?.fromBackend?.url;
    const placeholder = firstPhoto?.fromBackend?.placeholder;
    return (
      <Pressable
        onPress={() => handlePickMultipleImages(0, !!source)}
        style={({ pressed }) => styles.mainImageViewer(pressed, !source)}
      >
        <Condition
          if={source}
          then={
            <Image
              style={styles.mainImage}
              source={{ uri: source, placeholder }}
              contentFit='cover'
              transition={imageTransition}
            />
          }
          else={<FontAwesome6 name="add" size={theme.icons.md} color={theme.colors.gray300} />}
        />
        <View style={styles.imageNum}>
          <Text style={styles.imageNumText}>{1}</Text>
        </View>
      </Pressable>
    );
  }, [firstPhoto]);

  return (
    <VStack gap={theme.spacing.sp2}>
      <FirstPhoto />
      <Grid />
    </VStack>
  );
};


const uploadYourPhotosSheet = createStyleSheet((theme) => ({
  mainImage: {
    flex: 1,
    aspectRatio: 1.2,
    borderRadius: theme.radius.sm,
  },
  mainImageViewer: (isPressed: boolean, showBorder = true) => ({
    position: 'relative',
    aspectRatio: 1.2,
    borderWidth: showBorder ? 2 : undefined,
    backgroundColor: isPressed ? theme.colors.white80 : theme.colors.white100,
    borderColor: theme.colors.gray100,
    borderStyle: 'dashed',
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  image: {
    height: '100%',
    flex: 1,
    aspectRatio: 1.06,
    borderRadius: theme.radius.sm,
  },
  imageViewer: (isPressed: boolean, showBorder = true) => ({
    position: 'relative',
    height: '100%',
    flex: 1,
    aspectRatio: 1.06,
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
