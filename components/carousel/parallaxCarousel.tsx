import { imageTransition } from '@/constants/vars';
import { IPhoto } from '@/models/Photo';
import { Image } from 'expo-image';
import { FC, useRef, useState } from 'react';
import { View } from 'react-native';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { HStack } from '../utils/stacks';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';


interface ICarouselProps {
  photos: IPhoto[];
}
export const ParallaxCarousel: FC<ICarouselProps> = ({ photos }) => {
  const { styles, theme } = useStyles(styleSheet);
  const [step, setStep] = useState(0);
  const ref = useRef<ICarouselInstance>(null);

  return (
    <View style={{
      position: 'relative',
      borderRadius: theme.spacing.sp7,
      overflow: 'hidden'
    }}>
      <Carousel
        ref={ref}
        loop={photos.length > 1 ? true : false}
        height={UnistylesRuntime.screen.height * 0.3}
        width={UnistylesRuntime.screen.width}
        data={photos}
        modeConfig={{
          parallaxAdjacentItemScale: 0.9,
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        scrollAnimationDuration={600}
        onScrollEnd={index => setStep(index)}
        renderItem={({ item }) => (
          <Image
            placeholder={{ thumbhash: item?.placeholder }}
            recyclingKey={item?.placeholder}
            source={{ uri: item?.url }}
            style={styles.avatarImage}
            contentFit='cover'
            transition={imageTransition}
          />
        )}
      />
      {/* points */}
      <HStack gap={theme.spacing.sp4} styles={styles.points}>
        {photos.map((_, index) => (
          <View
            key={index}
            style={{
              width: theme.spacing.sp2,
              height: theme.spacing.sp2,
              borderRadius: 99_999,
              backgroundColor: (
                step === index ?
                  `rgba(255, 255, 255, ${0.8})` : `rgba(0, 0, 0, ${0.3})`
              ),
            }}
          />
        ))}
      </HStack>
    </View>
  );
};


const styleSheet = createStyleSheet((theme) => ({
  container: {
    width: '100%',
    aspectRatio: 1.2,
  },
  avatarImage: {
    height: '100%',
    width: '100%',
  },
  points: {
    position: 'absolute',
    bottom: theme.spacing.sp4,
    alignSelf: 'center'
  }
}));
