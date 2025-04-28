import { Badge } from '@/components/button/badge';
import { defaultImgPlaceholder, imageTransition } from '@/constants/vars';
import { Image } from 'expo-image';
import { FC, ReactNode } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import * as WebBrowser from 'expo-web-browser';
import Skeleton, { SkeletonLoading } from 'expo-skeleton-loading';
import { ILocation } from '@/models/Localization';
import { TextView } from '@/components/text/text';
const MySkeleton = Skeleton as FC<SkeletonLoading & { children: ReactNode }>;


export type IBucketListItem = {
  id?: number;
  img?: string;
  placeholder?: string;
  location?: ILocation;
  name?: string;
}

interface IProps {
  item: IBucketListItem
}
export const EventItem: FC<IProps> = ({ item }) => {
  const { styles, theme } = useStyles(stylesheet);

  const openLocationInBrowser = async () => {
    await WebBrowser.openBrowserAsync(item.location?.mapUrl ?? '');
  };

  return (
    <View style={{ position: 'relative' }}>
      <View style={{
        zIndex: 200,
        position: 'absolute',
        top: theme.spacing.sp6,
        left: theme.spacing.sp6,
      }}>
        {item?.name && (
          <TextView style={{
            color: theme.colors.white100,
            shadowColor: theme.colors.gray900,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 3,
            fontWeight: 'semibold',
            fontSize: theme.spacing.sp6,
          }}>
            {item.name}
          </TextView>
        )}
      </View>
      <Image
        placeholder={{ thumbhash: item?.placeholder }}
        recyclingKey={item?.img}
        source={{ uri: item?.img || defaultImgPlaceholder }}
        style={[styles.eventImage, { backgroundColor: theme.colors.gray100 }]}
        contentFit='cover'
        transition={imageTransition}
      />
      <TouchableOpacity onPress={openLocationInBrowser}>
        <Badge>
          {item?.location?.name ?? ''}
        </Badge>
      </TouchableOpacity>
    </View>
  );
};


export const EventItemSkeleton: FC = () => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <MySkeleton background={theme.colors.gray200} highlight={theme.colors.slate100}>
      <View style={[styles.eventImage, { backgroundColor: theme.colors.gray200 }]} />
    </MySkeleton>
  );
};


const stylesheet = createStyleSheet((theme, rt) => ({
  eventImage: {
    height: rt.screen.height * 0.25,
    width: 'auto',
    borderRadius: theme.spacing.sp7,
    // marginHorizontal: theme.spacing.sp6
  }
}));
