/* eslint-disable react/prop-types */
import { FC } from 'react';
import { Pressable, PressableProps, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { View, useColors } from '../Themed';
import { FontAwesome } from '@expo/vector-icons';
import { gray_50 } from '../../constants/colors';
import { Photo } from '../../models/Photo';
import { RectButton } from 'react-native-gesture-handler';
import { maximunNumberOfPhotos } from '../../constants/vars';
import { ForEach, If } from '../utils';


function range(length: number) {
  return Array.from({ length }, () => ({} as Partial<Photo>));
}

interface CloseBtnProps extends PressableProps {
  size?: 'large' | 'small'
}

interface AppPhotoGridProps {
  onHandlePickImage?: () => void,
  onDeleteImage?: (uuid: string) => void,
  photosList: Partial<Photo>[],
  placeholders?: number,
  height?: number
}
export const AppPhotosGrid: FC<AppPhotoGridProps> = ({ onHandlePickImage, onDeleteImage, photosList = [], height = 190 }) => {
  const { gray500, gray900, white50 } = useColors();
  const isFirstPhotoPresent = photosList.length === 0 ? 1 : 0;
  const remainingPhotos = photosList.length;
  const totalNumberOfPlaceholders: number = (
    (maximunNumberOfPhotos - isFirstPhotoPresent)
    -
    remainingPhotos
  );
  const emptyPlaceholders = range(totalNumberOfPlaceholders);
  const gridPhotos = photosList?.slice(1).concat(emptyPlaceholders) ?? [];


  const CloseButton: FC<CloseBtnProps> = ({ size = 'large', ...props }) => {
    const { style, ...anotherProps } = props;
    const width = size === 'large' ? 30 : 26;
    const fontSize = size === 'large' ? 22 : 18;
    return (
      <Pressable {...anotherProps} style={[gridStyles.closeBtn, { backgroundColor: gray900, width }]}>
        <FontAwesome name='close' style={{ color: white50, fontSize }} />
      </Pressable>
    );
  };


  const FirstPhoto: FC<{ photo: Partial<Photo> }> = ({ photo }) => (
    <View style={{ flex: 1, position: 'relative' }}>
      <If
        condition={photo?.url}
        render={(
          <>
            <Image placeholder={{ thumbhash: photo?.placeholder }} style={[gridStyles.uploadPhoto1, { objectFit: 'contain' }]} source={{ uri: photo?.url }} />
            <CloseButton onPress={() => onDeleteImage && photo?.uuid && onDeleteImage(photo.uuid)} />
          </>
        )}
        elseRender={(
          <RectButton style={gridStyles.uploadPhoto1} onPress={onHandlePickImage}>
            <FontAwesome style={{ fontSize: 32, color: gray500 }} name='plus-square-o' />
          </RectButton>
        )}
      />
    </View>
  );


  const Grid: FC = () => (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignContent: 'space-between'
      }}>
      <ForEach items={gridPhotos}>
        {(photo, i) => (
          <View
            key={photo?.uuid ?? i}
            style={[gridStyles.item, { position: 'relative' }]}>
            <View style={{ flex: 1, position: 'relative' }}>
              <If
                condition={photo?.url}
                render={(
                  <>
                    <Image placeholder={{ thumbhash: photo.placeholder }} style={[gridStyles.uploadPhotoGrid, { objectFit: 'contain' }]} source={{ uri: photo.url }} />
                    <CloseButton
                      size='small'
                      onPress={() => onDeleteImage && photo.uuid && onDeleteImage(photo.uuid)}
                    />
                  </>
                )}
                elseRender={(
                  <RectButton style={gridStyles.uploadPhotoGrid} onPress={onHandlePickImage}>
                    <FontAwesome style={{ fontSize: 28, color: gray500 }} name='plus-square-o' />
                  </RectButton>
                )}
              />
            </View>
          </View>
        )}
      </ForEach>
    </View>
  );


  return (
    <View style={{ height: height, flexDirection: 'row', gap: 12, marginTop: 7 }}>
      <FirstPhoto photo={photosList[0]} />
      <Grid />
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
    backgroundColor: gray_50,
    flex: 1,
    justifyContent: 'center'
  },

  uploadPhotoGrid: {
    alignItems: 'center',
    backgroundColor: gray_50,
    flex: 1,
    justifyContent: 'center',
  }
});
