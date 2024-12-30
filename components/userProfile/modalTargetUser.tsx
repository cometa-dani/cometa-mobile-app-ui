import {
  useInfiniteQueryGetSameMatchedEventsByTwoUsers,
  useInfiniteQueryGetTargetUserBucketList
} from '@/queries/targetUser/eventHooks';
import { FC, useCallback } from 'react';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { FlatList, Modal, TouchableOpacity, View, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { HeaderSkeleton, HeaderUserProfile } from './components/headerUser';
import { EventItem, EventItemSkeleton, IBucketListItem } from './components/eventItem';
import { Heading } from '../text/heading';
import { useQueryGetTargetUserPeopleProfile } from '@/queries/targetUser/userProfileHooks';
import { create } from 'zustand';
import { GradientHeading } from '../text/gradientText';
import { Center, VStack } from '../utils/stacks';
import { tabBarHeight } from '../tabBar/tabBar';
import { BlurView } from 'expo-blur';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { NewFriendsModal, useNewFriendsModal } from '../modal/newFriends/newFriends';
import { useCometaStore } from '@/store/cometaStore';
import { Condition } from '../utils/ifElse';
import { MatcheEventsModal, useMacthedEvents } from '../eventsList/matchedEventsModal';
// import { router } from 'expo-router';


export const ModalTargetUserProfile: FC = () => {
  const { theme, styles } = useStyles(styleSheet);
  const targetUser = useCometaStore(state => state.targetUser);
  const bucketList = useInfiniteQueryGetTargetUserBucketList(targetUser?.id);
  const detailedProfile = useQueryGetTargetUserPeopleProfile(targetUser?.uid ?? '');
  const matches = useInfiniteQueryGetSameMatchedEventsByTwoUsers(targetUser?.uid ?? '');
  const { onToggle: onToggleNewFriendsModal } = useNewFriendsModal();
  const { toggle, onToggle } = useModalTargetUser();
  const { onToggle: onToggleMatchedEvents } = useMacthedEvents();

  const handleInfinteBucketList = () => {
    if (bucketList) {
      const { hasNextPage, isFetching } = bucketList;
      hasNextPage && !isFetching && bucketList.fetchNextPage();
    }
  };
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

  const renderItem = useCallback(({ item }: { item: IBucketListItem }) => (
    <Pressable
      key={item?.id}
      onPress={onToggleMatchedEvents}
      style={{
        position: 'relative',
        width: (UnistylesRuntime.screen.width - (2 * theme.spacing.sp6)),
        flex: 1,
        marginHorizontal: theme.spacing.sp6
      }}>
      <EventItem item={item} />
    </Pressable>
  ), [onToggleMatchedEvents]);

  return (
    <Modal
      animationType='slide'
      visible={toggle}
      onRequestClose={onToggle}
      // statusBarTranslucent={true}
      // presentationStyle='overFullScreen'
      style={{ position: 'relative', zIndex: 10, flex: 1 }}
    >
      <NewFriendsModal />
      <MatcheEventsModal />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, backgroundColor: theme.colors.white80, position: 'relative' }}>
          <TouchableOpacity
            onPress={onToggle}
            style={styles.closeButton}
          >
            <AntDesign
              name="closecircle"
              size={theme.spacing.sp10}
              color={theme.colors.red100}
            />
          </TouchableOpacity>
          <View style={{ flex: 1, paddingHorizontal: theme.spacing.sp6 }}>
            <Center styles={{ height: 60, paddingBottom: 10 }}>
              <GradientHeading styles={[{ fontSize: theme.text.size.s8 }]}>
                {detailedProfile.data?.username || targetUser?.username}
              </GradientHeading>
            </Center>
            <Condition
              if={detailedProfile.isSuccess}
              then={
                <HeaderUserProfile
                  isTargetUser={true}
                  userProfile={detailedProfile.data || targetUser}
                  onPresss={onToggleNewFriendsModal}
                />
              }
              else={<HeaderSkeleton isTargetUser={true} />}
            />
          </View>
          <VStack gap={theme.spacing.sp6} styles={{ flex: 1, marginTop: theme.spacing.sp6 }}>
            <VStack>
              <Heading
                style={{ paddingHorizontal: theme.spacing.sp12, paddingBottom: theme.spacing.sp1 }}
                size='s6'
              >
                Matches
              </Heading>
              <Condition
                if={matches.isSuccess}
                then={(
                  <View style={{ position: 'relative' }}>
                    <Condition
                      if={false}
                      then={(
                        <BlurView intensity={100}
                          style={{
                            width: (UnistylesRuntime.screen.width - (2 * theme.spacing.sp6)),
                            height: UnistylesRuntime.screen.height * 0.25,
                            position: 'absolute',
                            zIndex: 100,
                            left: theme.spacing.sp6,
                            borderRadius: theme.spacing.sp7,
                            overflow: 'hidden',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <FontAwesome name="lock" size={theme.spacing.sp14} color={theme.colors.gray200} />
                        </BlurView>
                      )}
                    />
                    <FlatList
                      scrollEnabled={true}
                      nestedScrollEnabled={true}
                      data={matchesEvents}
                      pagingEnabled={true}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      onEndReachedThreshold={0.5}
                      onEndReached={handleInfinteMatches}
                      renderItem={renderItem}
                    />
                  </View>
                )}
                else={(
                  <View style={{ paddingHorizontal: theme.spacing.sp6 }}>
                    <EventItemSkeleton />
                  </View>
                )}
              />
            </VStack>

            <VStack>
              <Heading
                style={{ paddingHorizontal: theme.spacing.sp12, paddingBottom: theme.spacing.sp1 }}
                size='s6'
              >
                Bucketlist
              </Heading>
              <Condition
                if={bucketList.isSuccess}
                then={(
                  <FlatList
                    data={bucketListEvents}
                    nestedScrollEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    pagingEnabled={true}
                    onEndReachedThreshold={0.5}
                    onEndReached={handleInfinteBucketList}
                    renderItem={renderItem}
                  />
                )}
                else={(
                  <View style={{ paddingHorizontal: theme.spacing.sp6 }}>
                    <EventItemSkeleton />
                  </View>
                )}
              />
            </VStack>
            <View style={{ height: tabBarHeight * 2 }} />
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};


const styleSheet = createStyleSheet((theme) => ({
  closeButton: {
    padding: theme.spacing.sp6,
    borderRadius: theme.spacing.sp4,
    position: 'absolute',
    top: -theme.spacing.sp4,
    right: 0
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
