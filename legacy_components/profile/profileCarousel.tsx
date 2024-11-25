import { FC, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { View } from '../Themed';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Image } from 'expo-image';
import { IPhoto } from '../../models/Photo';
import { If } from '../utils/ifElse';
import ContentLoader, { Rect } from 'react-content-loader/native';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height * 0.45;

const SkeletonLoader: FC = () => (
  <ContentLoader
    speed={1}
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <Rect x="0" y="0" width="100%" height="100%" />
  </ContentLoader>
);

interface ProfileCarouselProps {
  userPhotos: IPhoto[],
  isLoading?: boolean
}

export const ProfileCarousel: FC<ProfileCarouselProps> = ({ userPhotos, isLoading = false }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <View style={carouselStyles.container}>
      <If
        condition={isLoading}
        render={<SkeletonLoader />}
        elseRender={
          <Carousel
            layout='default'
            loop={false}
            vertical={false}
            inactiveSlideScale={1}
            sliderWidth={width}
            itemWidth={width}
            data={userPhotos}
            onSnapToItem={(index) => setActiveSlide(index)}
            renderItem={({ item }) => (
              <Image
                key={item.uuid}
                placeholder={{ thumbhash: item?.placeholder }}
                style={{ height: height, width: '100%', objectFit: 'cover' }}
                source={item?.url}
              />
            )}
          />
        }
      />

      <Pagination
        dotsLength={userPhotos.length}
        activeDotIndex={activeSlide}
        containerStyle={carouselStyles.paginationContainer}
        dotStyle={carouselStyles.paginationDots}
        inactiveDotOpacity={0.5}
        inactiveDotScale={0.8}
      />
    </View>
  );
};


const carouselStyles = StyleSheet.create({
  container: {
    height: height,
    position: 'relative',
    width: '100%'
  },

  paginationContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    bottom: 0,
    position: 'absolute',
    width: '100%'
  },

  paginationDots: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 10,
    height: 10,
    marginHorizontal: -2,
    width: 10
  },
});
