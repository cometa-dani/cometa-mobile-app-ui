import { Badge } from '@/components/button/badge';
import { imageTransition } from '@/constants/vars';
import { Image } from 'expo-image';
import { FC, ReactNode } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import * as WebBrowser from 'expo-web-browser';
import Skeleton, { SkeletonLoading } from 'expo-skeleton-loading';
import { ILocation } from '@/models/Localization';
const MySkeleton = Skeleton as FC<SkeletonLoading & { children: ReactNode }>;


export type IBucketListItem = {
  id?: number;
  img?: string;
  placeholder?: string;
  location?: ILocation;
}

interface IProps {
  item: IBucketListItem
}
export const EventItem: FC<IProps> = ({ item }) => {
  const { styles } = useStyles(stylesheet);

  const openLocationInBrowser = async () => {
    await WebBrowser.openBrowserAsync(item.location?.mapUrl ?? '');
  };

  return (
    <View style={{ position: 'relative' }}>
      <Image
        placeholder={{ thumbhash: item?.placeholder }}
        recyclingKey={item?.img}
        source={{ uri: item?.img }}
        style={styles.eventImage}
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
