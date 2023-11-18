import { FC } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { Photo } from '../../models/User';
import { View, useColors } from '../Themed';
import { FontAwesome } from '@expo/vector-icons';


interface Props {
  onHandlePickImage?: () => void,
  onDeleteImage?: (uuid: string) => void,
  photosList: Photo[],
  placeholders?: number
}
export const PhotosGrid: FC<Props> = ({ onHandlePickImage, photosList, placeholders = 0 }) => {
  const { gray500 } = useColors();
  const placeholdersPhotos = (
    placeholders == 0 ?
      []
      :
      Array
        .from({ length: placeholders }, (_, index) => index)
        .map(() => ({} as Photo))
  );

  return (
    <View style={{ height: 150, flexDirection: 'row', gap: 12 }}>

      {/* col 1 */}
      <View style={{ flex: 1 }}>
        {photosList[0]?.url.length ? (
          <Image style={[gridStyles.uploadPhoto1, { objectFit: 'contain' }]} source={{ uri: photosList[0]?.url }} />
        ) : (
          <View style={gridStyles.uploadPhoto1}>
            <Pressable onPress={onHandlePickImage}>
              <FontAwesome style={{ fontSize: 34, color: gray500 }} name='plus-square-o' />
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
            style={gridStyles.item}>
            {url?.length ? (
              <Image style={gridStyles.uploadPhotoGrid} source={{ uri: url }} />
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
    </View>
  );
};


const gridStyles = StyleSheet.create({
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
