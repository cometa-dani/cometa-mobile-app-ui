/* eslint-disable no-unused-vars */
import { FC } from 'react';
import { Image, Pressable, PressableProps, StyleSheet } from 'react-native';
import { Photo } from '../../models/User';
import { Text, View, useColors } from '../Themed';
import { FontAwesome } from '@expo/vector-icons';


interface CloseBtnProps extends PressableProps {
  size?: 'large' | 'small'
}

interface AppPhotoGridProps {
  onHandlePickImage?: () => void,
  onDeleteImage?: (uuid: string) => void,
  photosList: Photo[],
  placeholders?: number
}
export const AppPhotosGrid: FC<AppPhotoGridProps> = ({ onHandlePickImage, onDeleteImage, photosList, placeholders = 0 }) => {
  const editorMode: boolean = onHandlePickImage || onDeleteImage ? true : false;
  const { gray500, gray900, white50 } = useColors();

  const lastItemOff = photosList.length === 0 ? - 1 : 0;
  const placeholdersPhotos = (
    placeholders == 0 ?
      []
      :
      Array
        .from({ length: placeholders + lastItemOff }, (_, index) => index)
        .map(() => ({} as Photo))
  );

  const CloseButton: FC<CloseBtnProps> = ({ size = 'large', ...props }) => {
    const { style, ...anotherProps } = props;
    const width = size === 'large' ? 30 : 26;
    const fontSize = size === 'large' ? 22 : 18;
    return (
      editorMode ? (
        <Pressable {...anotherProps} style={[gridStyles.closeBtn, { backgroundColor: gray900, width }]}>
          <FontAwesome name='close' style={{ color: white50, fontSize }} />
        </Pressable>
      ) :
        null
    );
  };

  return (
    <View style={{ height: 150, flexDirection: 'row', gap: 12 }}>

      {!editorMode && photosList.length === 0 ? (
        <Text>No photos available</Text>
      ) : (
        <>
          {/* col 1 */}
          <View style={{ flex: 1, position: 'relative' }}>
            {photosList[0]?.url.length ? (
              <>
                <Image style={[gridStyles.uploadPhoto1, { objectFit: 'contain' }]} source={{ uri: photosList[0]?.url }} />
                <CloseButton onPress={() => onDeleteImage && onDeleteImage(photosList[0]?.uuid)} />
              </>
            ) : (
              <View style={gridStyles.uploadPhoto1}>
                <Pressable onPress={onHandlePickImage}>
                  <FontAwesome style={{ fontSize: 32, color: gray500 }} name='plus-square-o' />
                </Pressable>
              </View>
            )}
          </View>
          {/* col 1 */}

          {/* grid */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignContent: 'space-between'
            }}>

            {photosList?.slice(1).concat(placeholdersPhotos).map(({ url, uuid }, i) => (
              <View
                key={uuid ?? i}
                style={[gridStyles.item, { position: 'relative' }]}>
                {url?.length ? (
                  <>
                    <Image style={gridStyles.uploadPhotoGrid} source={{ uri: url }} />
                    <CloseButton
                      size='small'
                      onPress={() => onDeleteImage && onDeleteImage(uuid)}
                    />
                  </>
                ) : (
                  <View style={gridStyles.uploadPhotoGrid}>
                    <Pressable onPress={onHandlePickImage}>
                      <FontAwesome style={{ fontSize: 28, color: gray500 }} name='plus-square-o' />
                    </Pressable>
                  </View>
                )}
              </View>
            ))}

          </View>
          {/* grid */}
        </>
      )}
    </View>
  );
};


const gridStyles = StyleSheet.create({
  closeBtn: {
    alignItems: 'center',
    aspectRatio: 1,
    borderRadius: 50,
    justifyContent: 'center',
    position: 'absolute',
    right: -6,
    top: -6,
  },

  item: {
    height: '46.6%',
    width: '46.6%',
  },

  uploadPhoto1: {
    alignItems: 'center',
    backgroundColor: '#ead4fa',
    borderRadius: 26,
    flex: 1,
    justifyContent: 'center'
  },

  uploadPhotoGrid: {
    alignItems: 'center',
    backgroundColor: '#ead4fa',
    borderRadius: 26,
    flex: 1,
    justifyContent: 'center',
  }
});
