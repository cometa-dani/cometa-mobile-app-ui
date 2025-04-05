import { FlashList } from '@shopify/flash-list';
import { FC, useCallback } from 'react';
import { UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { tabBarHeight } from '../tabBar/tabBar';
import { View } from 'react-native';
import { IGetDetailedUserProfile } from '@/models/User';
import { defaultImgPlaceholder } from '@/constants/vars';
import { IGetPaginatedLikedEventsBucketList } from '@/models/LikedEvent';
import { InfiniteData } from '@tanstack/react-query';
import { HeaderUserProfile, HeaderSkeleton } from './components/headerUser';
import { EventItem, EventItemSkeleton, IBucketListItem } from './components/eventItem';


const dummyBucketListItems = [
  {
    id: 1,
    img: defaultImgPlaceholder,
    placeholder: 'thumbhash1',
    location: 'New York City'
  },
  {
    id: 2,
    img: defaultImgPlaceholder,
    placeholder: 'thumbhash2',
    location: 'Los Angeles'
  },
  {
    id: 3,
    img: defaultImgPlaceholder,
    placeholder: 'thumbhash3',
    location: 'Chicago'
  },
  {
    id: 4,
    img: defaultImgPlaceholder,
    placeholder: 'thumbhash4',
    location: 'Houston'
  }
];

interface IProps {
  bucketList?: InfiniteData<IGetPaginatedLikedEventsBucketList, unknown>,
  profile?: IGetDetailedUserProfile,
  onBucketListEndReached: () => void,
  isListLoading?: boolean,
  isHeaderLoading?: boolean
}
export const UserProfile: FC<IProps> = ({
  bucketList: userBucketList,
  profile: userProfile,
  isListLoading = false,
  isHeaderLoading = false,
  onBucketListEndReached
}) => {
  const { theme } = useStyles();
  const bucketListEvents: IBucketListItem[] = (
    userBucketList?.pages.
      flatMap(({ items: events }) => (
        events.map(
          item => ({
            id: item.event?.id,
            img: item.event?.photos.at(0)?.url,
            placeholder: item.event?.photos.at(0)?.placeholder,
            location: item.event?.location?.name,
          })
        )
      )) || []
  );

  const renderHeader = useCallback(() => (
    isHeaderLoading ? (
      <HeaderSkeleton />
    ) : (
      <HeaderUserProfile userProfile={userProfile} />
    )
  ), [isHeaderLoading]);

  const renderBucketItem = useCallback(({ item }: { item: IBucketListItem }) => (
    isListLoading ? (
      <EventItemSkeleton />
    ) : (
      <EventItem item={item} />
    )
  ), [isListLoading]);

  return (
    <FlashList
      data={isListLoading ? dummyBucketListItems : bucketListEvents}
      showsVerticalScrollIndicator={false}
      estimatedItemSize={UnistylesRuntime.screen.height * 0.2}
      contentContainerStyle={{
        paddingVertical: theme.spacing.sp7,
        paddingHorizontal: theme.spacing.sp6
      }}
      ListFooterComponentStyle={{ height: tabBarHeight * 3 }}
      ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp6 }} />}
      ListHeaderComponent={renderHeader}
      onEndReachedThreshold={0.4}
      onEndReached={onBucketListEndReached}
      renderItem={renderBucketItem}
    />
  );
};
