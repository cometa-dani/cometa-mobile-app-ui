import {
  useInfiniteQueryGetSameMatchedEventsByTwoUsers,
  useInfiniteQueryGetTargetUserBucketList
} from '@/queries/targetUser/eventHooks';
import { FlashList } from '@shopify/flash-list';
import { createRef, FC, RefObject, useCallback } from 'react';
import { UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { Platform, SafeAreaView, View } from 'react-native';
import { defaultImgPlaceholder, imageTransition } from '@/constants/vars';
import { HeaderUserProfile, HeaderSkeleton, UserNameSkeleton } from './components/headerUser';
import { EventItem2, EventItemSkeleton, IBucketListItem } from './components/eventItem';
import { Heading } from '../text/heading';
import { Image } from 'expo-image';
import DefaultBottomSheet, { BottomSheetFlashList, BottomSheetFlatList, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { useQueryGetTargetUserPeopleProfile } from '@/queries/targetUser/userProfileHooks';
import { create } from 'zustand';
import { GradientHeading } from '../text/gradientText';
import { Center } from '../utils/stacks';
import { tabBarHeight } from '../tabBar/tabBar';
import { BlurView } from 'expo-blur';
import { FontAwesome } from '@expo/vector-icons';
import { useNewFriendsModal } from '../modal/newFriends/newFriends';
import { useCometaStore } from '@/store/cometaStore';
import { router } from 'expo-router';


const snapPoints = ['60%', '100%'];


export const BottomSheetTargetUserProfile: FC = () => {
  const { theme } = useStyles();
  const { bottomSheetRef } = useBootomSheetRef();
  const targetUser = useCometaStore(state => state.targetUser);
  const bucketList = useInfiniteQueryGetTargetUserBucketList(targetUser?.id);
  const detailedProfile = useQueryGetTargetUserPeopleProfile(targetUser?.uid ?? '');
  const matches = useInfiniteQueryGetSameMatchedEventsByTwoUsers(targetUser?.uid ?? '');
  const { onToggle } = useNewFriendsModal();
  // bottomSheetFlatListRef.current?.setNativeProps({refresh: true})
  // const [toggleModal, setToggleModal] = useReducer(prev => !prev, false);

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

  const isListHeaderSucess = detailedProfile.isSuccess && bucketList.isSuccess;

  const renderListHeader = useCallback(() => (
    !isListHeaderSucess ? (
      <BottomSheetView style={{ paddingHorizontal: theme.spacing.sp6 }}>
        <Center styles={{ height: 60, paddingBottom: 10 }}>
          <UserNameSkeleton />
        </Center>
        <HeaderSkeleton isTargetUser={true} />
        <View style={{
          position: 'relative',
          width: (UnistylesRuntime.screen.width - (2 * theme.spacing.sp6)),
        }}>
          <EventItemSkeleton />
        </View>
      </BottomSheetView>
    ) : (
      <BottomSheetView>
        <BottomSheetView style={{ paddingHorizontal: theme.spacing.sp6 }}>
          <Center styles={{ height: 60, paddingBottom: 10 }}>
            <GradientHeading styles={[{ fontSize: theme.text.size.s8 }]}>
              {detailedProfile.data?.username}
            </GradientHeading>
          </Center>
          <HeaderUserProfile
            isTargetUser={true}
            userProfile={detailedProfile.data}
          // onPresss={onToggle}
          // onPresss={() => router.push('/(userStacks)/settings')}
          />
        </BottomSheetView>

        {/* <BottomSheetView>
          <FlashList                      // TODO: encapsulate in a component
            data={bucketListEvents}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            pagingEnabled={true}
            estimatedItemSize={UnistylesRuntime.screen.width - (2 * theme.spacing.sp6)}
            onEndReachedThreshold={0.5}
            // onEndReached={handleInfinteBucketList}
            renderItem={({ item }) => (
              <BottomSheetView style={{
                position: 'relative',
                width: (UnistylesRuntime.screen.width - (2 * theme.spacing.sp6)),
                flex: 1,
                marginHorizontal: theme.spacing.sp6
              }}>
                <EventItem2 item={item} />
              </BottomSheetView>
            )}    // TODO: encapsulate in a component
          />
        </BottomSheetView> */}

        <BottomSheetView style={{ position: 'relative' }}>
          <Heading size='s6' style={{
            paddingHorizontal: theme.spacing.sp12,
            paddingBottom: theme.spacing.sp1,
            paddingTop: theme.spacing.sp6
          }}>
            Matches
          </Heading>
          <BlurView
            intensity={Platform.select({ ios: 40, android: 100 })}
            style={{
              borderRadius: theme.spacing.sp4,
              overflow: 'hidden',
              width: (UnistylesRuntime.screen.width - (2 * theme.spacing.sp6)),
              paddingHorizontal: theme.spacing.sp6,
              height: calcHeight(matchesEvents.length) * ((UnistylesRuntime.screen.height * 0.2) + theme.spacing.sp2),
              position: 'absolute',
              transform: [{ translateX: theme.spacing.sp6 }],
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 100,
              top: 45
            }} >
            <FontAwesome name="lock" size={theme.spacing.sp14} color={theme.colors.gray200} />
          </BlurView>
        </BottomSheetView>
      </BottomSheetView>
    )
  ), [isListHeaderSucess, onToggle, targetUser?.uid]);

  const renderMacthesItem = useCallback(({ item }: { item: IBucketListItem }) => (
    <BottomSheetView
      key={item?.id}
      style={{
        height: UnistylesRuntime.screen.height * 0.2,
        flex: 1 / 3,
        flexDirection: 'row',
        zIndex: -10
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
  ), [matches.isSuccess, targetUser?.uid]);

  return (
    <DefaultBottomSheet
      accessible={Platform.select({
        ios: false                    // needed for e2e testing, don't change
      })}
      ref={bottomSheetRef}
      index={-1}
      enableDynamicSizing={false}     // don't change
      enablePanDownToClose={true}     // don't change
      keyboardBehavior="fillParent"   // don't change
      snapPoints={snapPoints}
    >
      <BottomSheetFlatList
        scrollEnabled={true}
        style={{ flex: 1, backgroundColor: theme.colors.white80 }}
        data={matchesEvents}
        ListHeaderComponent={renderListHeader}
        numColumns={3}
        contentContainerStyle={{ paddingVertical: theme.spacing.sp7 }}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp2 }} />}
        ListFooterComponent={() => (<View style={{ height: tabBarHeight * 1.5 }} />)}
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
};

export const useBootomSheetRef = create<DefaultBottomSheetProps>((set, get) => ({
  bottomSheetRef: createRef<DefaultBottomSheet>(),
}));

const calcHeight = (length: number): number => {
  const ones = Array
    .from({ length: length + 1 }, (_, index) => index)
    .filter(index => index % 3 === 1);
  return ones.length;
};
