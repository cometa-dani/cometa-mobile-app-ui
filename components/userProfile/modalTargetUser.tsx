import {
  useInfiniteQueryGetSameMatchedEventsByTwoUsers,
  useInfiniteQueryGetTargetUserBucketList
} from '@/queries/targetUser/eventHooks';
import { FlashList } from '@shopify/flash-list';
import { createRef, FC, RefObject, useCallback } from 'react';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { FlatList, Modal, Platform, TouchableOpacity, View } from 'react-native';
import { defaultImgPlaceholder, imageTransition } from '@/constants/vars';
import { HeaderUserProfile, HeaderSkeleton, UserNameSkeleton } from './components/headerUser';
import { EventItem, EventItemSkeleton, IBucketListItem } from './components/eventItem';
import { Heading } from '../text/heading';
import { Image } from 'expo-image';
// import DefaultBottomSheet, { BottomSheetFlashList, BottomSheetFlatList, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { useQueryGetTargetUserPeopleProfile } from '@/queries/targetUser/userProfileHooks';
import { create } from 'zustand';
import { GradientHeading } from '../text/gradientText';
import { Center, HStack, VStack } from '../utils/stacks';
import { tabBarHeight } from '../tabBar/tabBar';
import { BlurView } from 'expo-blur';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useNewFriendsModal } from '../modal/newFriends/newFriends';
import { useCometaStore } from '@/store/cometaStore';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';


const snapPoints = ['60%', '100%'];


export const ModalTargetUserProfile: FC = () => {
  const { theme, styles } = useStyles(styleSheet);
  const targetUser = useCometaStore(state => state.targetUser);
  const bucketList = useInfiniteQueryGetTargetUserBucketList(targetUser?.id);
  const detailedProfile = useQueryGetTargetUserPeopleProfile(targetUser?.uid ?? '');
  const matches = useInfiniteQueryGetSameMatchedEventsByTwoUsers(targetUser?.uid ?? '');
  const { onToggle: onToggleNewFriendsModal } = useNewFriendsModal();
  const { toggle, onToggle } = useModalTargetUser();
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
      <View style={{ paddingHorizontal: theme.spacing.sp6 }}>
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
      </View>
    ) : (
      <View>
        <View style={{ paddingHorizontal: theme.spacing.sp6 }}>
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
        </View>

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
        </BottomSheetView>

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
        </BottomSheetView> */}
      </View>
    )
  ), [isListHeaderSucess, onToggleNewFriendsModal, targetUser?.uid]);

  const renderMacthesItem = useCallback(({ item }: { item: IBucketListItem }) => (
    <View
      key={item?.id}
      style={{
        // height: UnistylesRuntime.screen.height * 0.2,
        // flex: 1 / 3,
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
    </View>
  ), [matches.isSuccess, targetUser?.uid]);

  return (
    <Modal
      animationType='slide'
      visible={toggle}
      onRequestClose={onToggle}
      style={{ position: 'relative' }}
    >
      <SafeAreaView edges={{ bottom: 'off', top: 'additive' }} style={{ flex: 1, backgroundColor: theme.colors.white80 }}>
        <ScrollView
          style={{ flex: 1, position: 'relative' }}
        >
          <View style={{ paddingHorizontal: theme.spacing.sp6 }}>
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
          </View>
          <VStack gap={theme.spacing.sp6} styles={{ flex: 1 }}>
            <FlatList
              scrollEnabled={true}
              nestedScrollEnabled={true}
              // style={{ flex: 1, backgroundColor: theme.colors.white80 }}
              data={matchesEvents}
              // ListHeaderComponent={renderListHeader}
              pagingEnabled={true}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              // contentContainerStyle={{ paddingVertical: theme.spacing.sp7 }}
              // estimatedItemSize={UnistylesRuntime.screen.width - (2 * theme.spacing.sp6)}
              ListFooterComponent={() => (<View style={{ height: tabBarHeight * 1.5 }} />)}
              onEndReachedThreshold={0.5}
              // onEndReached={handleInfinteMatches}
              renderItem={({ item }) => (
                <View style={{
                  position: 'relative',
                  width: (UnistylesRuntime.screen.width - (2 * theme.spacing.sp6)),
                  flex: 1,
                  marginHorizontal: theme.spacing.sp6
                }}>
                  <EventItem item={item} />
                </View>
              )}
            />

            <FlatList                      // TODO: encapsulate in a component
              data={bucketListEvents}
              nestedScrollEnabled={true}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              pagingEnabled={true}
              // estimatedItemSize={UnistylesRuntime.screen.width - (2 * theme.spacing.sp6)}
              onEndReachedThreshold={0.5}
              // onEndReached={handleInfinteBucketList}
              renderItem={({ item }) => (
                <View style={{
                  position: 'relative',
                  width: (UnistylesRuntime.screen.width - (2 * theme.spacing.sp6)),
                  flex: 1,
                  marginHorizontal: theme.spacing.sp6
                }}>
                  <EventItem item={item} />
                </View>
              )}    // TODO: encapsulate in a component
            />
          </VStack>
          <View style={{ height: tabBarHeight * 2 }} />
        </ScrollView>
      </SafeAreaView>
      <TouchableOpacity
        onPress={onToggle}
        style={styles.closeButton}
      >
        <AntDesign
          // name="downcircle"
          name="closecircle"
          size={theme.spacing.sp11}
          // style={{ backgroundColor: theme.colors.white100 }}
          color={theme.colors.red100}
        />
      </TouchableOpacity>
    </Modal>
  );
};


const styleSheet = createStyleSheet((theme) => ({
  closeButton: {
    padding: theme.spacing.sp6,
    borderRadius: theme.spacing.sp4,
    position: 'absolute',
    top: theme.spacing.sp11,
    right: 0
    // backgroundColor: theme.colors.red100
  }
}));


type DefaultBottomSheetProps = {
  toggle: boolean
  onToggle: () => void
};

export const useModalTargetUser = create<DefaultBottomSheetProps>((set, get) => ({
  toggle: false,
  onToggle: () => set({ toggle: !get().toggle })
}));
