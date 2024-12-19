import { imageTransition } from '@/constants/vars';
import { IPhoto } from '@/models/Photo';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { FC, useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';


interface ICarouselProps {
  photos: IPhoto[];
}
export const Carousel: FC<ICarouselProps> = ({ photos }) => {
  const { styles, theme } = useStyles(styleSheet);

  const renderItem = useCallback(({ item }: { item: IPhoto }) => {
    return (
      <Image
        recyclingKey={item.url}
        transition={imageTransition}
        placeholder={{ thumbhash: item.placeholder }}
        source={{ uri: item.url }}
        style={styles.avatarImage}
        contentFit='cover'
      />
    );
  }, []);

  return (
    <View style={{ width: '100%', overflow: 'hidden', borderRadius: theme.spacing.sp7 }}>
      <FlashList
        data={photos}
        horizontal={true}
        pagingEnabled={true}
        decelerationRate={'normal'}
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={UnistylesRuntime.screen.height * 0.33}
        renderItem={renderItem}
      />
    </View>
  );
};


const styleSheet = createStyleSheet((theme, rt) => ({
  avatarImage: {
    width: rt.screen.width - (theme.spacing.sp6 * 2),
    aspectRatio: 1.2
  },
}));
