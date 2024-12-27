import { FlashList } from '@shopify/flash-list';
import { FC, useCallback } from 'react';
import { UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { tabBarHeight } from '../tabBar/tabBar';
import { FlatList, ScrollView, View } from 'react-native';
import { IGetTargetUser } from '@/models/User';
import { defaultImgPlaceholder, imageTransition } from '@/constants/vars';
import { IGetPaginatedLikedEventsBucketList } from '@/models/LikedEvent';
import { InfiniteData } from '@tanstack/react-query';
import { HeaderUserProfile, HeaderSkeleton } from './components/headerUser';
import { EventItem, EventItemSkeleton, IBucketListItem } from './components/eventItem';
import { IGetLatestPaginatedEvents } from '@/models/Event';
import { Heading } from '../text/heading';
import { TextView } from '../text/text';
import { Image } from 'expo-image';


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
            id: item?.event?.id,
            img: item?.event?.photos.at(0)?.url,
            placeholder: item?.event?.photos.at(0)?.placeholder,
            location: item?.event?.location?.name,
          })
        )
      )) || []
  );
  // const matchesEvents: IBucketListItem[] = (
  //   matches?.pages.
  //     flatMap(({ items: events }) => (
  //       events.map(
  //         item => ({
  //           id: item?.photos[0]?.id,
  //           img: item?.photos[0]?.url,
  //           placeholder: item?.photos[0]?.placeholder,
  //           location: item?.location?.name,
  //         })
  //       )
  //     )) || []
  // );

  const UserHeader: FC = useCallback(() => (
    isHeaderLoading ? (
      <HeaderSkeleton />
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
    <>
      {/* <ScrollView
        contentContainerStyle={{
          paddingTop: theme.spacing.sp7,
          paddingBottom: tabBarHeight * 2,
        }}>

        <UserHeader />

        <FlashList
          data={isListLoading ? dummyBucketListItems : bucketListEvents}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          pagingEnabled={true}
          estimatedItemSize={UnistylesRuntime.screen.height * 0.2}
          keyExtractor={item => item?.id?.toString()}
          onEndReachedThreshold={0.4}
          onEndReached={onBucketListEndReached}
          renderItem={renderBucketItem}
        />
        <Heading size='s6' style={{
          paddingHorizontal: theme.spacing.sp6,
          paddingBottom: theme.spacing.sp1,
          paddingTop: theme.spacing.sp6
        }}>
          Matches
        </Heading>

      </ScrollView> */}

      <FlatList
        data={dummyBucketListItems}
        // showsHorizontalScrollIndicator={false}
        numColumns={3}
        style={{
          flex: 1
        }}
        columnWrapperStyle={{
          gap: theme.spacing.sp2
        }}
        keyExtractor={item => item?.id?.toString()}
        ItemSeparatorComponent={() => <View style={{ width: theme.spacing.sp2 }} />}
        renderItem={({ item, index }) => (
          <Image
            key={index}
            source={{ uri: item?.img }}
            placeholder={{ thumbhash: item?.placeholder }}
            style={{
              height: UnistylesRuntime.screen.height * 0.2,
              // width: 'auto',
              // flex: 1,
              width: '100%',
              // width: UnistylesRuntime.screen.width / 3,
              borderRadius: theme.spacing.sp4
            }}
            contentFit='cover'
            transition={imageTransition}
            recyclingKey={item?.img}
          />
        )}
      />
    </>
  );
};

{/* <MasonryFlashList
        data={dummyBucketListItems}
        showsHorizontalScrollIndicator={false}
        numColumns={3}
        estimatedItemSize={UnistylesRuntime.screen.height * 0.2}
        // contentContainerStyle={{
        //   paddingHorizontal: theme.spacing.sp6,
        //   paddingTop: theme.spacing.sp7,
        //   paddingBottom: tabBarHeight * 2
        // }}
        // ListHeaderComponent={() => (
        //   <>

        //   </>
        // )}
        // keyExtractor={item => item?.id?.toString()}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp2 }} />}
        // onEndReachedThreshold={0.4}
        // onEndReached={onBucketListEndReached}
        renderItem={({ columnIndex, item }) => (
          <View style={{
            // marginLeft: columnIndex === 0 ? 0 : theme.spacing.sp2, // Add spacing for other columns
            height: UnistylesRuntime.screen.height * 0.2,
          }}>
            <Image
              source={{ uri: item?.img }}
              placeholder={{ thumbhash: item?.placeholder }}
              style={{
                height: UnistylesRuntime.screen.height * 0.2,
                // width: 'auto',
                borderRadius: theme.spacing.sp4
              }}
              contentFit='cover'
              transition={imageTransition}
              recyclingKey={item?.img}
            />
          </View>
        )}
      /> */}
