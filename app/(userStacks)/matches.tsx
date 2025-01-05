import {
  useInfiniteQueryGetNewestFriends,
  useMutationAcceptFriendshipInvitation,
  useMutationDeleteFriendshipInvitation,
  useMutationSentFriendshipInvitation
} from '@/queries/currentUser/friendshipHooks';
import { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, View, } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { GradientHeading } from '@/components/text/gradientText';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { TextView } from '@/components/text/text';
import PagerView, { usePagerView } from 'react-native-pager-view';
import { Center, HStack, VStack } from '@/components/utils/stacks';
import { useCometaStore } from '@/store/cometaStore';
import { Button } from '@/components/button/button';
import Animated, { FadeOut, LinearTransition } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { imageTransition } from '@/constants/vars';
import { Badge } from '@/components/button/badge';
import { useInfiteQueryGetUsersWhoLikedSameEvent } from '@/queries/targetUser/userProfileHooks';
import { Condition } from '@/components/utils/ifElse';
import { EmptyMessage } from '@/components/empty/Empty';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import Skeleton, { SkeletonLoading } from 'expo-skeleton-loading';
import { IGetBasicUserProfile, IGetTargetUser, IUsersWhoLikedSameEvent } from '@/models/User';
import { Friendship } from '@/models/Friendship';
import { NewFriendsModal } from '@/components/modal/newFriends/newFriends';
import { ErrorMessage } from '@/queries/errors/errorMessages';
import { Notifier } from 'react-native-notifier';
import { ErrorToast } from '@/components/toastNotification/toastNotification';
const MySkeleton = Skeleton as FC<SkeletonLoading & { children: ReactNode }>;


const SkeletonList: FC = () => {
  const { theme, styles } = useStyles(styleSheet);
  return (
    <FlashList
      data={[1, 2, 3, 4, 5, 6, 7]}
      estimatedItemSize={60}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}
      contentContainerStyle={{ paddingVertical: theme.spacing.sp6 }}
      ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp6 }} />}
      renderItem={() => (
        <MySkeleton background={theme.colors.gray200} highlight={theme.colors.slate100}>
          <HStack
            $y='center'
            gap={theme.spacing.sp4}
            styles={{ paddingHorizontal: theme.spacing.sp6 }}
          >
            <View style={[
              styles.imgAvatar,
              { backgroundColor: theme.colors.gray200 }
            ]} />
            <VStack
              $y='center'
              gap={theme.spacing.sp1}
              styles={{ flex: 1 }}
            >
              <View style={{
                backgroundColor: theme.colors.gray200,
                height: 16,
                width: '60%',
                flexDirection: 'row',
                borderRadius: 10
              }}
              />
              <View style={{
                backgroundColor: theme.colors.gray200,
                height: 16,
                width: '80%',
                flexDirection: 'row',
                borderRadius: 10
              }}
              />
            </VStack>
            <View style={{
              width: 94,
              backgroundColor: theme.colors.gray200,
              borderRadius: theme.spacing.sp2
            }}>
              <Button
                style={{ padding: 6, borderRadius: theme.spacing.sp2 }}
                onPress={() => { }}
                variant='primary'>
                FOLLOW
              </Button>
            </View>
          </HStack>
        </MySkeleton>
      )}
    />
  );
};

const initialTab = 1;


export default function MatchedEventsScreen(): ReactNode {
  const router = useRouter();
  const { styles, theme } = useStyles(styleSheet);

  // tabs
  const selectedLikedEvent = useCometaStore(state => state.likedEvent);
  const [isFirstItemVisible, setIsFirstItemVisible] = useState(true);
  const { ref, setPage } = usePagerView();
  const [step, setStep] = useState(initialTab);

  // header image
  const [showImage, setShowImage] = useState(true);
  useEffect(() => {
    if (!isFirstItemVisible) {
      setShowImage(false);
    } else {
      setShowImage(true);
    }
  }, [isFirstItemVisible]);

  // friends/new people
  const newPeople = useInfiteQueryGetUsersWhoLikedSameEvent(+selectedLikedEvent?.id);
  const newFriends = useInfiniteQueryGetNewestFriends();
  const newPeopleData: IUsersWhoLikedSameEvent[] = newPeople.data?.pages.flatMap(page => page.items) ?? [];
  const newFriendsData: Friendship[] = newFriends.data?.pages.flatMap(page => page.items) ?? [];
  useRefreshOnFocus(newPeople.refetch);

  // infinite scroll
  const handleNewPeopleInfiniteScroll = (): void => {
    if (newPeople) {
      const { hasNextPage, isFetching, fetchNextPage } = newPeople;
      hasNextPage && !isFetching && fetchNextPage();
    }
  };
  const handleNewFriendsInfiniteScroll = (): void => {
    if (newFriends) {
      const { hasNextPage, isFetching, fetchNextPage } = newFriends;
      hasNextPage && !isFetching && fetchNextPage();
    }
  };

  // mutations
  const sentFriendship = useMutationSentFriendshipInvitation();
  const acceptFriendship = useMutationAcceptFriendshipInvitation();
  const cancelFriendship = useMutationDeleteFriendshipInvitation();
  const selectedTargetUser = useCometaStore(state => state.targetUser);
  const setSelectedTargetUser = useCometaStore(state => state.setTargetUser);
  const [showNewFriendsModal, setShowNewFriendsModal] = useState(false);

  const handleSentFriendship = (targetUser: IGetBasicUserProfile) => {
    setSelectedTargetUser(targetUser as IGetTargetUser);
    sentFriendship.mutate(targetUser.id,
      {
        onError: ({ response }) => {
          if (response?.data.message === ErrorMessage.INVITATION_ALREADY_PENDING) {
            Notifier.showNotification({
              title: 'Error',
              description: 'something went wrong, we will try again',
              Component: ErrorToast,
            });
            handleAcceptFriendship(targetUser);
          }
          else {
            Notifier.showNotification({
              title: 'Error',
              description: 'something went wrong, try again',
              Component: ErrorToast,
            });
          }
        }
      }
    );
  };

  const handleAcceptFriendship = (targetUser: IGetBasicUserProfile) => {
    setSelectedTargetUser(targetUser as IGetTargetUser);
    setShowNewFriendsModal(true);
    acceptFriendship.mutate(targetUser.id,
      {
        onError: ({ response }) => {
          setShowNewFriendsModal(false);
          if (response?.data.message === ErrorMessage.INVITATION_DOES_NOT_EXIST) {
            Notifier.showNotification({
              title: 'Error',
              description: 'something went wrong, we will try again',
              Component: ErrorToast,
            });
            handleSentFriendship(targetUser);
          }
          else {
            Notifier.showNotification({
              title: 'Error',
              description: 'something went wrong, try again',
              Component: ErrorToast,
            });
          }
        }
      }
    );
  };

  const handleCancelFriendship = (targetUser: IGetBasicUserProfile) => {
    setSelectedTargetUser(targetUser as IGetTargetUser);
    cancelFriendship.mutate(targetUser.id);
  };

  const renderNewFriend = useCallback(({ item: { friend } }: { item: { friend: IGetBasicUserProfile } }) => (
    <HStack
      $y='center'
      gap={theme.spacing.sp4}
      styles={{
        paddingHorizontal: theme.spacing.sp6,
        paddingBottom: theme.spacing.sp6
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setSelectedTargetUser(friend as IGetTargetUser);
          router.push('/(userStacks)/targetUser');
        }}
        style={{
          flex: 1, flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing.sp4
        }}
      >
        <Image
          recyclingKey={friend?.uid}
          transition={imageTransition}
          source={{ uri: friend?.photos.at(0)?.url }}
          placeholder={{ thumbhash: friend?.photos.at(0)?.placeholder }}
          style={styles.imgAvatar}
        />
        <VStack
          $y='center'
          styles={{ flex: 1 }}
        >
          <TextView bold={true} ellipsis={true}>
            {friend?.name}
          </TextView>
          <TextView ellipsis={true}>
            {friend?.username}
          </TextView>
        </VStack>
      </TouchableOpacity>

      <Button
        style={{ padding: 6, borderRadius: theme.spacing.sp2, width: 100 }}
        onPress={() => {
          setSelectedTargetUser(friend as IGetTargetUser);
          router.push(`/(userStacks)/chat?friendUuid=${friend?.id}`);
        }}
        variant='gray-alt'>
        Chat
      </Button>
    </HStack>
  ), []);

  const renderNewPeople = useCallback(({ item: { user: targetUser } }: { item: { user: IGetBasicUserProfile } }) => {
    const { hasOutgoingFriendshipInvitation, hasIncommingFriendshipInvitation } = targetUser;
    const showPending = (sentFriendship.isPending || cancelFriendship.isPending || acceptFriendship.isPending) && selectedTargetUser?.id === targetUser.id;
    return (
      <HStack
        $y='center'
        gap={theme.spacing.sp4}
        styles={{
          paddingHorizontal: theme.spacing.sp6,
          paddingBottom: theme.spacing.sp6
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setSelectedTargetUser(targetUser as IGetTargetUser);
            router.push('/(userStacks)/targetUser');
          }}
          style={{
            flex: 1, flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: theme.spacing.sp4
          }}
        >
          <Image
            recyclingKey={targetUser?.uid}
            transition={imageTransition}
            source={{ uri: targetUser?.photos.at(0)?.url }}
            placeholder={{ thumbhash: targetUser?.photos.at(0)?.placeholder }}
            style={styles.imgAvatar}
          />
          <VStack
            $y='center'
            styles={{ flex: 1 }}
          >
            <TextView bold={true} ellipsis={true}>
              {targetUser?.name}
            </TextView>
            <TextView ellipsis={true}>
              {targetUser?.username}
            </TextView>
          </VStack>
        </TouchableOpacity>

        {!hasIncommingFriendshipInvitation && !hasOutgoingFriendshipInvitation && (
          <Button
            showLoading={showPending}
            style={{ padding: 6, borderRadius: theme.spacing.sp2, width: 110 }}
            onPress={() => !showPending && handleSentFriendship(targetUser)}
            variant='primary'>
            Follow
          </Button>
        )}
        {hasOutgoingFriendshipInvitation && !hasIncommingFriendshipInvitation && (
          <Button
            showLoading={showPending}
            style={{ padding: 6, borderRadius: theme.spacing.sp2, width: 110 }}
            onPress={() => !showPending && handleAcceptFriendship(targetUser)}
            variant='primary'>
            Follow
          </Button>
        )}
        {hasIncommingFriendshipInvitation && !hasOutgoingFriendshipInvitation && (
          <Button
            showLoading={showPending}
            style={{ padding: 6, borderRadius: theme.spacing.sp2, width: 110 }}
            onPress={() => !showPending && handleCancelFriendship(targetUser)}
            variant='gray'>
            Pending
          </Button>
        )}
      </HStack>
    );
  }, [selectedTargetUser?.id, sentFriendship.isPending, cancelFriendship.isPending, acceptFriendship.isPending]);

  return (
    <>
      <NewFriendsModal
        open={showNewFriendsModal}
        onClose={() => setShowNewFriendsModal(false)}
      />

      <Stack.Screen
        options={{
          headerShown: true,
          headerSearchBarOptions: {
            autoFocus: false,
            placeholder: 'search',
            tintColor: theme.colors.red100,
            inputType: 'text',
            barTintColor: theme.colors.white80,
            onFocus: () => {
              setShowImage(false);
            },
            onBlur: () => {
              setShowImage(true);
            },
          },
          animation: 'fade',
          headerTitleAlign: 'center',
          headerTitle: () => (
            <GradientHeading styles={[{ fontSize: theme.text.size.s8 }]}>
              matches
            </GradientHeading>
          ),
        }}
      />

      <SafeAreaView
        style={{
          flex: 1,
          gap: showImage ? theme.spacing.sp4 : 0,
          backgroundColor: theme.colors.white80
        }}>
        {showImage &&
          <Animated.View
            // entering={ZoomIn.withInitialValues({ transform: [{ scale: 0 }] }).duration(390)}
            exiting={FadeOut.duration(390)}
          >
            <View style={{ padding: theme.spacing.sp6, paddingBottom: 0, position: 'relative' }}>
              <Image
                transition={imageTransition}
                contentFit='cover'
                style={styles.imgHeader}
                source={{ uri: selectedLikedEvent.photos.at(0)?.url, }}
              />
              <Badge>
                {selectedLikedEvent?.location?.name}
              </Badge>
            </View>
          </Animated.View>
        }
        <Animated.View
          style={{ flex: 1 }}
          layout={LinearTransition.duration(450)}
        >
          <View
            style={{
              flexDirection: 'row',
              gap: theme.spacing.sp4,
              padding: theme.spacing.sp2,
              paddingHorizontal: showImage ? theme.spacing.sp2 : theme.spacing.sp6,
              marginHorizontal: showImage ? theme.spacing.sp6 : 0,
              borderRadius: showImage ? 20 : 0,
              backgroundColor: theme.colors.white60
            }}
          >
            <Button
              style={{ flex: 1 }}
              onPress={() => setPage(0)}
              variant={step === 1 ? 'disabled' : 'primary'}
            >
              New Friends
            </Button>
            <Button
              style={{ flex: 1 }}
              onPress={() => setPage(1)}
              variant={step === 1 ? 'primary' : 'disabled'}
            >
              New People
            </Button>
          </View>
          <PagerView
            ref={ref}
            style={{ height: '100%', width: '100%', flex: 1 }}
            initialPage={initialTab}
            onPageScroll={(e) => {
              setStep(e.nativeEvent.position);
            }}
          >
            <View key={0} style={{ flex: 1 }}>
              <Condition
                if={!newFriends.isSuccess}
                then={<SkeletonList />}
                else={(
                  <Condition
                    if={!newFriendsData?.length}
                    then={(
                      <Center styles={{ paddingHorizontal: 34, paddingTop: 0, flex: 1 / 3 }}>
                        <EmptyMessage
                          title='Oops! Looks like your list is empty'
                          subtitle='Head back to the homepage and add some exciting events!'
                        />
                      </Center>
                    )}
                    else={(
                      <FlashList
                        nestedScrollEnabled={true}
                        data={newFriendsData}
                        estimatedItemSize={60}
                        ListFooterComponentStyle={{ height: UnistylesRuntime.screen.height * 0.45 }}
                        contentContainerStyle={{ paddingVertical: theme.spacing.sp6 }}
                        onViewableItemsChanged={({ viewableItems }) => {
                          const firstItem = viewableItems[0];
                          const isVisible = firstItem?.index === 0;
                          setIsFirstItemVisible(isVisible);
                        }}
                        onEndReachedThreshold={0.5}
                        onEndReached={handleNewFriendsInfiniteScroll}
                        renderItem={renderNewFriend}
                      />
                    )}
                  />
                )}
              />
            </View>

            <View key={1} style={{ flex: 1 }}>
              <Condition
                if={!newPeople.isSuccess}
                then={<SkeletonList />}
                else={(
                  <Condition
                    if={!newPeopleData?.length}
                    then={(
                      <Center styles={{ paddingHorizontal: 34, paddingTop: 0, flex: 1 / 3 }}>
                        <EmptyMessage
                          title='Oops! Looks like your list is empty'
                          subtitle='Head back to the homepage and add some exciting events!'
                        />
                      </Center>
                    )}
                    else={(
                      <FlashList
                        nestedScrollEnabled={true}
                        ListFooterComponentStyle={{ height: UnistylesRuntime.screen.height * 0.45 }}
                        contentContainerStyle={{ paddingVertical: theme.spacing.sp6 }}
                        onViewableItemsChanged={({ viewableItems }) => {
                          const firstItem = viewableItems[0];
                          const isVisible = firstItem?.index === 0;
                          setIsFirstItemVisible(isVisible);
                        }}
                        data={newPeopleData}
                        estimatedItemSize={60}
                        onEndReachedThreshold={0.5}
                        onEndReached={handleNewPeopleInfiniteScroll}
                        renderItem={renderNewPeople}
                      />
                    )}
                  />
                )}
              />
            </View>
          </PagerView>
        </Animated.View>
      </SafeAreaView>
    </>
  );
}


const styleSheet = createStyleSheet((theme, runtime) => ({
  imgHeader: {
    width: '100%',
    height: runtime.screen.height * 0.3,
    borderRadius: theme.spacing.sp7
  },
  imgAvatar: {
    width: 60, height: 60, borderRadius: 50
  }
}));
