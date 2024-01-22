import { FC, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { View } from '../Themed';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Image } from 'expo-image';
import { Photo } from '../../models/User';


const carouselEstimatedWidth = Dimensions.get('window').width;


interface ProfileCarouselProps {
  userPhotos: Photo[]
}

export const ProfileCarousel: FC<ProfileCarouselProps> = ({ userPhotos }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <View style={carouselStyles.container}>
      <Carousel
        layout='stack'
        loop={true}
        // slideStyle={{ paddingVertical: 20 }} // use with tinder
        vertical={false}
        activeSlideOffset={0}
        inactiveSlideScale={0.78}
        sliderWidth={carouselEstimatedWidth}
        itemWidth={carouselEstimatedWidth}
        data={userPhotos}
        onSnapToItem={(index) => setActiveSlide(index)}
        renderItem={({ item }) => (
          <Image
            key={item.uuid}
            placeholder={'L39HdjPsUhyE05m0ucW,00lTm]R5'}
            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
            source={item.url}
          />
        )}
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
    height: 300, position: 'relative', width: '100%'
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
