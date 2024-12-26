import { FlashList } from '@shopify/flash-list';
import { FC, useCallback } from 'react';
import { UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { tabBarHeight } from '../tabBar/tabBar';
import { ScrollView, View } from 'react-native';
import { IGetTargetUser } from '@/models/User';
import { defaultImgPlaceholder } from '@/constants/vars';
import { IGetPaginatedLikedEventsBucketList } from '@/models/LikedEvent';
import { InfiniteData } from '@tanstack/react-query';
import { HeaderUserProfile, HeaderSkeleton } from './components/headerUser';
import { EventItem, EventItemSkeleton, IBucketListItem } from './components/eventItem';
import { IGetLatestPaginatedEvents } from '@/models/Event';


const dummyBucketListItems = [
  {
    id: 1,
    img: defaultImgPlaceholder,
    placeholder: 'thumbhash1',
    location: 'New York City'
  }
];

interface IProps {
  userBucketList?: InfiniteData<IGetPaginatedLikedEventsBucketList, unknown>,
  matches?: InfiniteData<IGetLatestPaginatedEvents, unknown>,
  userProfile?: IGetTargetUser,
  onBucketListEndReached: () => void,
  isListLoading?: boolean,
  isHeaderLoading?: boolean
}
export const TargetUserProfile: FC<IProps> = ({
  userBucketList,
  matches,
  userProfile,
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
            id: item.event?.photos[0]?.id,
            img: item.event?.photos[0]?.url,
            placeholder: item.event?.photos[0]?.placeholder,
            location: item.event?.location?.name,
          })
        )
      )) || []
  );
  const matchesEvents: IBucketListItem[] = (
    matches?.pages.
      flatMap(({ items: events }) => (
        events.map(
          item => ({
            id: item.photos[0]?.id,
            img: item.photos[0]?.url,
            placeholder: item.photos[0]?.placeholder,
            location: item.location?.name,
          })
        )
      )) || []
  );

  const UserHeader: FC = useCallback(() => (
    isHeaderLoading ? (
      <HeaderSkeleton isTargetUser={true} />
    ) : (
      <HeaderUserProfile isTargetUser={true} userProfile={userProfile} />
    )
  ), [isHeaderLoading]);

  const renderBucketItem = useCallback(({ item }: { item: IBucketListItem }) => (
    isListLoading ? (
      <View style={{ position: 'relative', width: UnistylesRuntime.screen.width }}>
        <EventItemSkeleton />
      </View>
    ) : (
      <View style={{ position: 'relative', width: UnistylesRuntime.screen.width }}>
        <EventItem item={item} />
      </View>
    )
  ), [isListLoading]);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: theme.spacing.sp7,
        paddingBottom: tabBarHeight * 2,
        gap: theme.spacing.sp6
      }}>
      <UserHeader />
      <FlashList
        data={isListLoading ? dummyBucketListItems : matchesEvents}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        pagingEnabled={true}
        estimatedItemSize={UnistylesRuntime.screen.height * 0.2}
        keyExtractor={item => item.id?.toString()}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp6 }} />}
        onEndReachedThreshold={0.4}
        onEndReached={onBucketListEndReached}
        renderItem={renderBucketItem}
      />
      <FlashList
        data={isListLoading ? dummyBucketListItems : bucketListEvents}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        pagingEnabled={true}
        estimatedItemSize={UnistylesRuntime.screen.height * 0.2}
        keyExtractor={item => item.id?.toString()}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp6 }} />}
        onEndReachedThreshold={0.4}
        onEndReached={onBucketListEndReached}
        renderItem={renderBucketItem}
      />
    </ScrollView>
  );
};
