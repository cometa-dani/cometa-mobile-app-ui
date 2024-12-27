import { FlashList } from '@shopify/flash-list';
import { createRef, FC, RefObject, useCallback } from 'react';
import { UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { Platform, View } from 'react-native';
import { defaultImgPlaceholder, imageTransition } from '@/constants/vars';
import { HeaderUserProfile, HeaderSkeleton, UserNameSkeleton } from './components/headerUser';
import { EventItem, EventItemSkeleton, IBucketListItem } from './components/eventItem';
import { Heading } from '../text/heading';
import { Image } from 'expo-image';
import DefaultBottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import { useQueryGetTargetUserPeopleProfile } from '@/queries/targetUser/userProfileHooks';
import { useInfiniteQueryGetSameMatchedEventsByTwoUsers, useInfiniteQueryGetTargetUserBucketList } from '@/queries/targetUser/eventHooks';
import { create } from 'zustand';
import { GradientHeading } from '../text/gradientText';
import { Center } from '../utils/stacks';
import { tabBarHeight } from '../tabBar/tabBar';


const snapPoints = ['60%', '100%'];
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
    location: 'San Francisco'
  }
];

export const TargetUserProfile: FC = () => {
  const { theme } = useStyles();
  const { bottomSheetRef, userUuid } = useBootomSheetRef();
  const userProfile = useQueryGetTargetUserPeopleProfile(userUuid);
  const matches = useInfiniteQueryGetSameMatchedEventsByTwoUsers(userUuid);
  const bucketList = useInfiniteQueryGetTargetUserBucketList(userProfile?.data?.id);

  // TODO: encapsulate in a component, too much rendering on infinite scroll
  // const handleInfinteBucketList = () => {
  //   if (bucketList) {
  //     const { hasNextPage, isFetching } = bucketList;
  //     hasNextPage && !isFetching && bucketList.fetchNextPage();
  //   }
  // };
  const handleInfinteMatches = () => {
    if (matches) {
      const { hasNextPage, isFetching } = matches;
      hasNextPage && !isFetching && matches.fetchNextPage();
    }
  };

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
      <>
        <Center styles={{ height: 60, paddingBottom: 10 }}>
          <UserNameSkeleton />
        </Center>
        <HeaderSkeleton isTargetUser={true} />
      </>
    ) : (
      <>
        <Center styles={{ height: 60, paddingBottom: 10 }}>
          <GradientHeading styles={[{ fontSize: theme.text.size.s8 }]}>
            {userProfile.data?.username}
          </GradientHeading>
        </Center>
        <HeaderUserProfile
          isTargetUser={true}
          userProfile={userProfile.data}
        />
      </>
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

  const renderMacthesItem = useCallback(({ item }: { item: IBucketListItem }) => (
    <BottomSheetView
      key={item?.id}
      style={{
        height: UnistylesRuntime.screen.height * 0.2,
        flex: 1 / 3,
        flexDirection: 'row',
      }}
    >
      <Image
        recyclingKey={item?.img}
        source={{ uri: item?.img }}
        transition={imageTransition}
        placeholder={{ thumbhash: item?.placeholder }}
        style={{
          width: '100%',
          flex: 1,
          borderRadius: theme.spacing.sp4
        }}
      />
    </BottomSheetView>
  ), [userUuid]);


  return (
    <DefaultBottomSheet
      accessible={Platform.select({
        ios: false                    // needed for e2e testing, don't change
      })}
      ref={bottomSheetRef}
      index={-1}
      containerStyle={{ flex: 1 }}
      enableDynamicSizing={false}     // don't change
      enablePanDownToClose={true}     // don't change
      keyboardBehavior="fillParent"   // don't change
      snapPoints={snapPoints}
    >
      <BottomSheetFlatList
        style={{
          flex: 1,
          backgroundColor: theme.colors.white80
        }}
        data={matchesEvents}
        ListHeaderComponent={() => (
          <View>
            <BottomSheetView style={{ paddingHorizontal: theme.spacing.sp6 }}>
              <UserHeader />
            </BottomSheetView>
            <BottomSheetView>
              <FlashList                      // TODO: encapsulate in a component
                data={(
                  !bucketList.isSuccess ?
                    dummyBucketListItems.slice(0, 1) : bucketListEvents
                )}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                pagingEnabled={true}
                estimatedItemSize={UnistylesRuntime.screen.height * 0.2}
                onEndReachedThreshold={0.5}
                // onEndReached={handleInfinteBucketList}
                renderItem={renderBucketItem}    // TODO: encapsulate in a component
              />
            </BottomSheetView>

            <BottomSheetView>
              <Heading size='s6' style={{
                paddingHorizontal: theme.spacing.sp12,
                paddingBottom: theme.spacing.sp1,
                paddingTop: theme.spacing.sp6
              }}>
                Matches
              </Heading>
            </BottomSheetView>
          </View>
        )}
        numColumns={3}
        contentContainerStyle={{ paddingVertical: theme.spacing.sp7 }}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp2 }} />}
        ListFooterComponent={() => <View style={{ height: tabBarHeight * 1.5 }} />}
        columnWrapperStyle={{
          gap: theme.spacing.sp2,
          paddingHorizontal: theme.spacing.sp6
        }}
        onEndReachedThreshold={0.5}
        onEndReached={handleInfinteMatches}
        renderItem={renderMacthesItem}
      />
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
