import { imageTransition } from '@/constants/vars';
import { IPhoto } from '@/models/Photo';
import { Image } from 'expo-image';
import { FC, useState } from 'react';
import { View } from 'react-native';
import PagerView, { usePagerView } from 'react-native-pager-view';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { HStack } from '../utils/stacks';


interface ICarouselProps {
  photos: IPhoto[];
}
export const Carousel: FC<ICarouselProps> = ({ photos }) => {
  const { styles, theme } = useStyles(styleSheet);
  const { ref } = usePagerView();
  const [step, setStep] = useState(0);

  return (
    <View style={{
      position: 'relative',
      borderRadius: theme.spacing.sp7,
      overflow: 'hidden'
    }}>
      <PagerView
        ref={ref}
        style={styles.container}
        initialPage={0}
        onPageScroll={(e) => {
          setStep(e.nativeEvent.position);
        }}
      >
        {photos.map((item, index) => (
          <View key={index} style={{ width: '100%', height: '100%' }}>
            <Image
              transition={imageTransition}
              placeholder={{ thumbhash: item?.placeholder }}
              source={{ uri: item?.url }}
              style={styles.avatarImage}
              contentFit='cover'
              recyclingKey={item?.placeholder}
            />
          </View>
        ))}
      </PagerView>

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
