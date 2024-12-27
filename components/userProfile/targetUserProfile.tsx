import { FlashList, MasonryFlashList } from '@shopify/flash-list';
import { createRef, FC, forwardRef, RefObject, useCallback } from 'react';
import { UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { tabBarHeight } from '../tabBar/tabBar';
import { FlatList, Platform, ScrollView, View } from 'react-native';
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
import DefaultBottomSheet, { BottomSheetFlatList, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { useQueryGetTargetUserPeopleProfile } from '@/queries/targetUser/userProfileHooks';
import { useInfiniteQueryGetSameMatchedEventsByTwoUsers, useInfiniteQueryGetTargetUserBucketList } from '@/queries/targetUser/eventHooks';
import { create } from 'zustand';
import { SafeAreaView } from 'react-native-safe-area-context';

const snapPoints = ['60%', '100%'];
const dummyBucketListItems = [
  {
    id: 1,
    img: defaultImgPlaceholder,
    placeholder: 'thumbhash1',
    location: 'New York City'
  }
];

// interface IProps {
//   // bucketList?: InfiniteData<IGetPaginatedLikedEventsBucketList, unknown>,
//   // matches?: InfiniteData<IGetLatestPaginatedEvents, unknown>,
//   // profile?: IGetTargetUser,
//   // isBucketListLoading?: boolean,
//   // isMatchesLoading?: boolean,
//   // isHeaderLoading?: boolean
//   // onBucketListEndReached: () => void,
//   userUuid: string
// }
export const TargetUserProfile: FC = () => {
  const { theme } = useStyles();
  const { bottomSheetRef, userUuid } = useBootomSheetRef();
  const userProfile = useQueryGetTargetUserPeopleProfile(userUuid);
  const matches = useInfiniteQueryGetSameMatchedEventsByTwoUsers(userUuid);
  const bucketList = useInfiniteQueryGetTargetUserBucketList(userProfile?.data?.id);
  const bucketListEvents: IBucketListItem[] = (
    bucketList.data?.pages.
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
  console.log(userUuid);
  const matchesEvents: IBucketListItem[] = (
    matches.data?.pages.
      flatMap(({ items: events }) => (
        events.map(
          item => ({
            id: item?.photos[0]?.id,
            img: item?.photos[0]?.url,
            placeholder: item?.photos[0]?.placeholder,
            location: item?.location?.name,
          })
        )
      )) || []
  );

  const UserHeader: FC = useCallback(() => (
    !userProfile.isSuccess ? (
      <HeaderSkeleton isTargetUser={true} />
    ) : (
      <HeaderUserProfile
        isTargetUser={true}
        userProfile={userProfile.data}
      />
    )
  ), [userProfile.isSuccess, userUuid]);

  const renderBucketItem = useCallback(({ item }: { item: IBucketListItem }) => (
    !bucketList.isSuccess ? (
      <View style={{ position: 'relative', width: UnistylesRuntime.screen.width }}>
        <EventItemSkeleton />
      </View>
    ) : (
      <View style={{ position: 'relative', width: UnistylesRuntime.screen.width }}>
        <EventItem item={item} />
      </View>
    )
  ), [bucketList.isSuccess, userUuid]);

  return (
    <DefaultBottomSheet
      accessible={Platform.select({
        ios: false                    // needed for e2e testing, don't change
      })}
      ref={bottomSheetRef}
      // containerStyle={{
      //   backgroundColor: theme.colors.white80,
      // }}
      // style={{ backgroundColor: theme.colors.white80 }}
      index={-1}
      enableDynamicSizing={false}     // don't change
      enablePanDownToClose={true}     // don't change
      keyboardBehavior="fillParent"   // don't change
      snapPoints={snapPoints}
    >

      {/* <BottomSheetScrollView style={{
          // paddingVertical: theme.spacing.sp7,
          // paddingHorizontal: theme.spacing.sp10,
        }}>

        </BottomSheetScrollView> */}


      <SafeAreaView
        edges={{ bottom: 'off' }}
        style={{
          flex: 1,
          backgroundColor: theme.colors.white80,
          paddingVertical: theme.spacing.sp7
        }}>
        <BottomSheetFlatList
          data={matchesEvents}
          ListHeaderComponent={() => (
            <BottomSheetView>
              <UserHeader />

              <FlashList
                data={!bucketList.isSuccess ? dummyBucketListItems : bucketListEvents}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                pagingEnabled={true}
                estimatedItemSize={UnistylesRuntime.screen.height * 0.2}
                onEndReachedThreshold={0.4}
                // onEndReached={onBucketListEndReached}
                renderItem={renderBucketItem}
              />
              <Heading size='s6' style={{
                paddingHorizontal: theme.spacing.sp6,
                paddingBottom: theme.spacing.sp1,
                paddingTop: theme.spacing.sp6
              }}>
                Matches
              </Heading>
            </BottomSheetView>
            // </SafeAreaView>
          )}
          style={{ flex: 1 }}
          // contentContainerStyle={{
          //   paddingHorizontal: theme.spacing.sp6,
          //   paddingVertical: theme.spacing.sp7
          // }}
          numColumns={3}
          ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp2 }} />}
          columnWrapperStyle={{
            gap: theme.spacing.sp2
          }}
          renderItem={(item) => (
            <View
              key={item?.item?.id}
              style={{
                height: UnistylesRuntime.screen.height * 0.2,
                flex: 1 / 3,
                flexDirection: 'row',
              }}
            >
              <Image
                source={{ uri: item?.item?.img }}
                placeholder={{ thumbhash: item?.item?.placeholder }}
                style={{
                  width: '100%',
                  flex: 1,
                  borderRadius: theme.spacing.sp4
                }}
              />
            </View>
          )}
        />
      </SafeAreaView>
      {/* <FlatList
        data={dummyBucketListItems}
        // showsHorizontalScrollIndicator={false}
        numColumns={3}
        style={{
          flex: 1
        }}
        columnWrapperStyle={{
          gap: theme.spacing.sp2
        }}
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
      /> */}
    </DefaultBottomSheet>
  );
};

// TargetUserProfile.displayName = 'TargetUserProfile';


type DefaultBottomSheetProps = {
  bottomSheetRef: RefObject<DefaultBottomSheet>;
  userUuid: string;

  setTargetUser: (targetUser: string) => void;
};

export const useBootomSheetRef = create<DefaultBottomSheetProps>((set, get) => ({
  bottomSheetRef: createRef<DefaultBottomSheet>(),
  userUuid: '',

  setTargetUser: (targetUser: string) => {
    set({ userUuid: targetUser });
  },
}));
