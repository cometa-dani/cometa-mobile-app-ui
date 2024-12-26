import { FC, ReactNode, useEffect, useState } from 'react';
import { SafeAreaView, View, } from 'react-native';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useInfiniteQueryGetNewestFriends } from '@/queries/currentUser/friendshipHooks';
import { GradientHeading } from '@/components/text/gradientText';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { TextView } from '@/components/text/text';
import PagerView, { usePagerView } from 'react-native-pager-view';
import { Center, HStack, VStack } from '@/components/utils/stacks';
import { useCometaStore } from '@/store/cometaStore';
import { Button } from '@/components/button/button';
import Animated, { ZoomIn, FadeOut, LinearTransition, } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { imageTransition } from '@/constants/vars';
import { Badge } from '@/components/button/badge';
import { useInfiteQueryGetUsersWhoLikedSameEvent } from '@/queries/targetUser/userProfileHooks';
import { Condition } from '@/components/utils/ifElse';
import { EmptyMessage } from '@/components/empty/Empty';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import Skeleton, { SkeletonLoading } from 'expo-skeleton-loading';
const MySkeleton = Skeleton as FC<SkeletonLoading & { children: ReactNode }>;


const SkeletonList: FC = () => {
  const { theme, styles } = useStyles(styleSheet);
  return (
    <FlashList
      data={[1, 2, 3, 4, 5, 6, 7]}
      estimatedItemSize={60}
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
            <Button
              style={{ padding: 6, borderRadius: theme.spacing.sp2, width: 94 }}
              onPress={() => { }}
              variant='primary'>
              FOLLOW
            </Button>
          </HStack>
        </MySkeleton>
      )}
    />
  );
};


const initialTab = 1;

export default function MatchedEventsScreen(): ReactNode {
  const { styles, theme } = useStyles(styleSheet);
  const { eventId } = useGlobalSearchParams<{ eventId: string }>();
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
  const newPeople = useInfiteQueryGetUsersWhoLikedSameEvent(+eventId);
  const newFriends = useInfiniteQueryGetNewestFriends();
  const newPeopleData = newPeople.data?.pages.flatMap(page => page.items) ?? [];
  const newFriendsData = newFriends.data?.pages.flatMap(page => page.items) ?? [];
  useRefreshOnFocus(newPeople.refetch);

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

  return (
    <>
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

      <SafeAreaView style={{
        flex: 1,
        gap: showImage ? theme.spacing.sp4 : 0,
        backgroundColor: theme.colors.white80
      }}>
        {showImage &&
          <Animated.View
            entering={ZoomIn.withInitialValues({ transform: [{ scale: 0 }] }).duration(460)}
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
        <Animated.View layout={LinearTransition.duration(450)}>
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
            style={{ height: '100%', width: '100%' }}
            initialPage={initialTab}
            onPageScroll={(e) => {
              setStep(e.nativeEvent.position);
            }}
          >
            <View key={0} style={{ flex: 1, height: '100%' }}>
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
                        ListFooterComponentStyle={{ height: 400 }}
                        contentContainerStyle={{ paddingVertical: theme.spacing.sp6 }}
                        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp6 }} />}
                        onViewableItemsChanged={({ viewableItems }) => {
                          const firstItem = viewableItems[0];
                          const isVisible = firstItem?.index === 0;
                          setIsFirstItemVisible(isVisible);
                        }}
                        onEndReachedThreshold={0.5}
                        onEndReached={handleNewFriendsInfiniteScroll}
                        renderItem={({ item: { friend } }) => (
                          <HStack
                            $y='center'
                            gap={theme.spacing.sp4}
                            styles={{ paddingHorizontal: theme.spacing.sp6 }}
                          >
                            <Image
                              recyclingKey={friend.uid}
                              placeholder={{ thumbhash: friend.photos.at(0)?.placeholder }}
                              transition={imageTransition}
                              source={{ uri: friend.photos.at(0)?.url }}
                              style={styles.imgAvatar}
                            />

                            <VStack
                              $y='center'
                              styles={{ flex: 1 }}
                            >
                              <TextView bold={true} ellipsis={true}>
                                {friend.name}
                              </TextView>
                              <TextView ellipsis={true}>
                                {friend.username}
                              </TextView>
                            </VStack>

                            <Button
                              style={{ padding: 6, borderRadius: theme.spacing.sp2, width: 94 }}
                              onPress={() => { console.log('follow'); }}
                              variant='primary-alt'>
                              CHAT
                            </Button>
                          </HStack>
                        )}
                      />
                    )}
                  />
                )}
              />
            </View>

            <View key={1} style={{ flex: 1, height: '100%' }}>
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
                        ListFooterComponentStyle={{ height: 400 }}
                        contentContainerStyle={{ paddingVertical: theme.spacing.sp6 }}
                        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp6 }} />}
                        onViewableItemsChanged={({ viewableItems }) => {
                          const firstItem = viewableItems[0];
                          const isVisible = firstItem?.index === 0;
                          setIsFirstItemVisible(isVisible);
                        }}
                        data={newPeopleData}
                        estimatedItemSize={60}
                        onEndReachedThreshold={0.5}
                        onEndReached={handleNewPeopleInfiniteScroll}
                        renderItem={({ item: { user } }) => (
                          <HStack
                            $y='center'
                            gap={theme.spacing.sp4}
                            styles={{ paddingHorizontal: theme.spacing.sp6 }}
                          >
                            <Image
                              recyclingKey={user?.uid}
                              transition={imageTransition}
                              source={{ uri: user.photos.at(0)?.url }}
                              placeholder={{ thumbhash: user?.photos.at(0)?.placeholder }}
                              style={styles.imgAvatar}
                            />

                            <VStack
                              $y='center'
                              styles={{ flex: 1 }}
                            >
                              <TextView bold={true} ellipsis={true}>
                                {user.name}
                              </TextView>
                              <TextView ellipsis={true}>
                                {user.username}
                              </TextView>
                            </VStack>

                            <Button
                              style={{ padding: 6, borderRadius: theme.spacing.sp2, width: 94 }}
                              onPress={() => { console.log('follow'); }}
                              variant='primary'>
                              FOLLOW
                            </Button>
                          </HStack>
                        )}
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
