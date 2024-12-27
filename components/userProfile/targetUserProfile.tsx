import { FlashList } from '@shopify/flash-list';
import { createRef, FC, RefObject, useCallback } from 'react';
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
import DefaultBottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
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
      <View style={{
        position: 'relative',
        width: (UnistylesRuntime.screen.width - (2 * theme.spacing.sp6)),
        marginHorizontal: theme.spacing.sp6
      }}>
        <EventItemSkeleton />
      </View>
    ) : (
      <View style={{
        position: 'relative',
        width: (UnistylesRuntime.screen.width - (2 * theme.spacing.sp6)),
        marginHorizontal: theme.spacing.sp6
      }}>
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
      index={-1}
      containerStyle={{
        flex: 1
      }}
      enableDynamicSizing={false}     // don't change
      enablePanDownToClose={true}     // don't change
      keyboardBehavior="fillParent"   // don't change
      snapPoints={snapPoints}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <BottomSheetFlatList
          data={matchesEvents}
          ListHeaderComponent={() => (
            <BottomSheetView>
              <View style={{ paddingHorizontal: theme.spacing.sp6 }}>
                <UserHeader />
              </View>
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
          )}
          style={{
            backgroundColor: theme.colors.white80,
            paddingVertical: theme.spacing.sp7
          }}
          numColumns={3}
          contentContainerStyle={{
            paddingVertical: theme.spacing.sp7,
            // paddingHorizontal: theme.spacing.sp6
          }}
          ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp2 }} />}
          ListFooterComponent={() => <View style={{ height: 200 }} />}
          columnWrapperStyle={{
            gap: theme.spacing.sp2,
            paddingHorizontal: theme.spacing.sp6
          }}
          renderItem={({ item }) => (
            <View
              key={item?.id}
              style={{
                height: UnistylesRuntime.screen.height * 0.2,
                flex: 1 / 3,
                flexDirection: 'row',
              }}
            >
              <Image
                source={{ uri: item?.img }}
                placeholder={{ thumbhash: item?.placeholder }}
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
    </DefaultBottomSheet>
  );
};


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
