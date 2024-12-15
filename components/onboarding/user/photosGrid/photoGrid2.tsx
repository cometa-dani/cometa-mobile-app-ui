import { VStack } from '@/components/utils/stacks';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { FC, ReactNode, useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Condition } from '@/components/utils/ifElse';
import { ForEach } from '@/components/utils/ForEach';
import { imageTransition } from '@/constants/vars';
import { Notifier } from 'react-native-notifier';
import { ErrorToast } from '@/components/toastNotification/toastNotification';
import { IPhoto } from '@/models/Photo';


type ImagePickerAsset = ImagePicker.ImagePickerAsset


export type IPhotoPlaceholder = {
  position: number;
  pickedUpAsset?: ImagePickerAsset,
  storedPhoto?: IPhoto
}

export const createPlaceholders = (MAX_NUMBER: number, usersPhotos: IPhoto[] = []): IPhotoPlaceholder[] => {
  const fullPlaceholders = usersPhotos.map((asset, index) => ({
    position: index,
    pickedUpAsset: undefined,
    storedPhoto: asset
  }));
  const remainingPlaceholders = MAX_NUMBER - usersPhotos.length;
  const emptyPlaceholders = (
    Array
      .from({ length: remainingPlaceholders })
      .map((_, index) => ({
        position: fullPlaceholders.length + index,
        pickedUpAsset: undefined,
        storedPhoto: undefined
      }))
  );
  return [...fullPlaceholders, ...emptyPlaceholders,];
};


/**
 *
 * @description Generates a 2D array from a 1D array
 */
function generate2DArray<T>(arr: T[], nestedLength: number = 3): T[][] {
  const _2DArr: T[][] = [];
  arr.forEach((photo, index) => {
    if (index % nestedLength === 0) {
      _2DArr.push([photo]);
    }
    else {
      _2DArr.at(-1)?.push(photo);
    }
  });
  return _2DArr;
}


export const hasAsset = (photo: IPhotoPlaceholder) => photo?.pickedUpAsset;

const appendPhoto = (pickedPhotos: ImagePickerAsset[]) => {
  const appendPhoto = (prev: IPhotoPlaceholder[]) => {
    let counter = 0;
    const currentAssets = prev.filter(hasAsset);
    return (
      prev.map((photo, index, arr) => {
        const shouldReplace = (index + 1) > (currentAssets.length);
        if (shouldReplace) {
          const newPhoto = {
            ...photo,
            pickedUpAsset: pickedPhotos?.at(counter)
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
  const replacePhoto = (prev: IPhotoPlaceholder[]) => {
    return prev.map(photo => {
      const isSelected = photo.position === selectedPosition;
      if (isSelected) {
        return {
          ...photo,
          pickedUpAsset: pickedPhotos?.at(0)
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
  setInitialPhotos: () => IPhotoPlaceholder[],
  action?: 'create' | 'update',
  footer?: () => ReactNode
}
export const PhotosGrid2: FC<IPhotosGridProps> = ({ setInitialPhotos, onSelect, action = 'create', footer }) => {
  const { styles, theme } = useStyles(uploadYourPhotosSheet);
  const [userPhotos = [], setUserPhotos] = useState<IPhotoPlaceholder[]>(setInitialPhotos);
  const [firstPhoto, ...restPhotos] = userPhotos;
  console.log({ userPhotos });

  const handlePickMultipleImages = async (selectedPosition = 0, isPositionSelected = false) => {
    const currentAssets = userPhotos.filter(hasAsset); // filter out the already exisisting images
    const isGridFull = userPhotos.length === currentAssets.length;
    try {
      const takePhotos: number = userPhotos.length - currentAssets.length; // take a number below the limit
      const pickedPhotos = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: action === 'update' ? false : !isGridFull, // picks multiple images
        allowsEditing: action === 'update' ? true : isPositionSelected,
        selectionLimit: isGridFull ? 1 : takePhotos,
        aspect: [4, 3],
        quality: 1,
      });
      if (!pickedPhotos.canceled) {
        const newPhotos = (
          isPositionSelected ?
            replacePhoto(pickedPhotos.assets, selectedPosition)(userPhotos)
            : appendPhoto(pickedPhotos.assets)(userPhotos)
        );
        setUserPhotos(newPhotos); // update the grid's state
        if (action === 'create') {
          onSelect(newPhotos); // lift up all the new photos
        }
        if (action === 'update') {
          onSelect([{         // lift up the single updated photo
            position: selectedPosition,
            pickedUpAsset: pickedPhotos.assets[0],
            storedPhoto: userPhotos.at(selectedPosition)?.storedPhoto
          }]);
        }
      }
    }
    catch (error) {
      Notifier.showNotification({
        title: 'Error',
        description: 'the image could not be loaded',
        Component: ErrorToast
      });
      return null;
    }
  };

  const Grid: FC = useCallback(() => (
    <ForEach items={generate2DArray(restPhotos)}>
      {(row, i = 0, arr = []) => (
        <View key={i} style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap', gap: theme.spacing.sp2 }}>
          <ForEach items={row}>
            {(cell, j = 0) => {
              const initialUrl = cell?.storedPhoto?.url || cell?.pickedUpAsset?.uri;
              const placeholder = cell?.storedPhoto?.placeholder;
              const source = action === 'create' ? cell?.pickedUpAsset?.uri : cell?.storedPhoto?.url;
              return (
                <Pressable
                  key={j}
                  style={({ pressed }) => styles.imageViewer(pressed, !source)}
                  onPress={() => handlePickMultipleImages(cell.position, !!source)}
                >
                  <Condition
                    if={initialUrl}
                    then={
                      <Image
                        recyclingKey={initialUrl}
                        source={{ uri: source, placeholder }}
                        style={styles.image}
                        contentFit='cover'
                        transition={imageTransition}
                      />
                    }
                    else={
                      <FontAwesome6 name="add" size={theme.icons.md} color={theme.colors.gray300} />
                    }
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

  const initialUrl = firstPhoto?.storedPhoto?.url || firstPhoto?.pickedUpAsset?.uri;
  const placeholder = firstPhoto?.storedPhoto?.placeholder;
  const source = action === 'create' ? firstPhoto?.pickedUpAsset?.uri : firstPhoto?.storedPhoto?.url;

  return (
    <VStack gap={theme.spacing.sp2}>
      <Pressable
        onPress={() => handlePickMultipleImages(0, !!source)}
        style={({ pressed }) => styles.mainImageViewer(pressed, !source)}
      >
        <Condition
          if={initialUrl}
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
