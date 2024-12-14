import React, { ReactNode, useEffect, useState } from 'react';
import { SafeAreaView, View, } from 'react-native';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useInfiteQueryGetUsersWhoLikedSameEventByID } from '@/queries/targetUser/eventHooks';
import { IGetPaginatedLikedEventsBucketList } from '@/models/LikedEvent';
import { QueryKeys } from '@/queries/queryKeys';
import { useInfiniteQueryGetLoggedInUserNewestFriends } from '@/queries/currentUser/friendshipHooks';
import { GradientHeading } from '@/components/text/gradientText';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { TextView } from '@/components/text/text';
import PagerView, { usePagerView } from 'react-native-pager-view';
import { HStack, VStack } from '@/components/utils/stacks';
import { useCometaStore } from '@/store/cometaStore';
import { Button } from '@/components/button/button';
import Animated, { ZoomIn, FadeOut, LinearTransition, } from 'react-native-reanimated';
import { Image } from 'expo-image';


const users = [
  {
    'name': 'Emily Chen',
    'email': 'emily.chen@example.com',
    'avatar': 'https://picsum.photos/200/300?random=1'
  },
  {
    'name': 'Liam Patel',
    'email': 'liam.patel@example.com',
    'avatar': 'https://picsum.photos/200/300?random=2'
  },
  {
    'name': 'Ava Lee',
    'email': 'ava.lee@example.com',
    'avatar': 'https://picsum.photos/200/300?random=3'
  },
  {
    'name': 'Noah Kim',
    'email': 'noah.kim@example.com',
    'avatar': 'https://picsum.photos/200/300?random=4'
  },
  {
    'name': 'Sophia Rodriguez',
    'email': 'sophia.rodriguez@example.com',
    'avatar': 'https://picsum.photos/200/300?random=5'
  },
  {
    'name': 'Ethan Hall',
    'email': 'ethan.hall@example.com',
    'avatar': 'https://picsum.photos/200/300?random=6'
  },
  {
    'name': 'Mia Garcia',
    'email': 'mia.garcia@example.com',
    'avatar': 'https://picsum.photos/200/300?random=7'
  },
  {
    'name': 'Logan Brooks',
    'email': 'logan.brooks@example.com',
    'avatar': 'https://picsum.photos/200/300?random=8'
  },
  {
    'name': 'Isabella Taylor',
    'email': 'isabella.taylor@example.com',
    'avatar': 'https://picsum.photos/200/300?random=9'
  },
  {
    'name': 'Alexander White',
    'email': 'alexander.white@example.com',
    'avatar': 'https://picsum.photos/200/300?random=10'
  },
  {
    'name': 'Charlotte Davis',
    'email': 'charlotte.davis@example.com',
    'avatar': 'https://picsum.photos/200/300?random=11'
  },
  {
    'name': 'Benjamin Martin',
    'email': 'benjamin.martin@example.com',
    'avatar': 'https://picsum.photos/200/300?random=12'
  },
  {
    'name': 'Abigail Harris',
    'email': 'abigail.harris@example.com',
    'avatar': 'https://picsum.photos/200/300?random=13'
  },
  {
    'name': 'Caleb Thompson',
    'email': 'caleb.thompson@example.com',
    'avatar': 'https://picsum.photos/200/300?random=14'
  },
  {
    'name': 'Harper Jenkins',
    'email': 'harper.jenkins@example.com',
    'avatar': 'https://picsum.photos/200/300?random=15'
  }
];

export default function MatchedEventsScreen(): ReactNode {
  const { styles, theme } = useStyles(styleSheet);
  const { eventId } = useGlobalSearchParams<{ eventId: string }>();
  const likedEvent = useCometaStore(state => state.likedEvent);
  const [isFirstItemVisible, setIsFirstItemVisible] = useState(true);
  const { ref, setPage } = usePagerView();
  const [step, setStep] = useState(0);
  // const eventLike = useQueryCachedBucketListItem(+eventIndex);
  // people state
  // const newPeopleData = useInfiteQueryGetUsersWhoLikedSameEventByID(+eventId);
  // const newFriendsData = useInfiniteQueryGetLoggedInUserNewestFriends();


  // const memoizedFriendsList = useMemo(() => (
  //   newFriendsData.data?.pages.flatMap(page => page?.friendships) ?? []
  // ), [newFriendsData.data?.pages]);
  // const memoizedNewPeopleList = useMemo(() => (
  //   // newPeopleData.data?.pages.flatMap(page => page?.items) ?? []
  // ), [newPeopleData.data?.pages]);


  const handleNewPeopleInfiniteScroll = (): void => {
    // if (newPeopleData) {
    //   const { hasNextPage, isFetching, fetchNextPage } = newPeopleData;
    //   hasNextPage && !isFetching && fetchNextPage();
    // }
  };
  const [showImage, setShowImage] = useState(true);

  useEffect(() => {
    if (!isFirstItemVisible) {
      setShowImage(false);
    } else {
      setShowImage(true);
    }
  }, [isFirstItemVisible]);

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
            <View style={{ padding: theme.spacing.sp6, paddingBottom: 0 }}>
              <Image
                contentFit='cover'
                style={styles.imgHeader}
                source={{ uri: likedEvent.photos.at(0)?.url, }}
              />
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
            initialPage={0}
            onPageScroll={(e) => {
              setStep(e.nativeEvent.position);
            }}
          >
            <View key={0} style={{ flex: 1, height: '100%' }}>
              <FlashList
                nestedScrollEnabled={true}
                data={users}
                estimatedItemSize={60}
                ListFooterComponentStyle={{ height: 400 }}
                contentContainerStyle={{ paddingVertical: theme.spacing.sp6 }}
                ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp6 }} />}
                onViewableItemsChanged={({ viewableItems }) => {
                  const firstItem = viewableItems[0];
                  const isVisible = firstItem?.index === 0;
                  setIsFirstItemVisible(isVisible);
                }}
                renderItem={({ item }) => (
                  <HStack
                    $y='center'
                    gap={theme.spacing.sp4}
                    styles={{ paddingHorizontal: theme.spacing.sp6 }}
                  >
                    <Image
                      source={{ uri: item.avatar }}
                      style={styles.imgAvatar}
                    />

                    <VStack
                      $y='center'
                      styles={{ flex: 1 }}
                    >
                      <TextView ellipsis={true}>
                        {item.name}
                      </TextView>
                      <TextView bold={true} ellipsis={true}>
                        {item.email}
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
            </View>
            <View key={1} style={{ flex: 1, height: '100%' }}>
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
                data={users}
                estimatedItemSize={60}
                renderItem={({ item }) => (
                  <HStack
                    $y='center'
                    gap={theme.spacing.sp4}
                    styles={{ paddingHorizontal: theme.spacing.sp6 }}
                  >
                    <Image
                      source={{ uri: item.avatar }}
                      style={styles.imgAvatar}
                    />

                    <VStack
                      $y='center'
                      styles={{ flex: 1 }}
                    >
                      <TextView ellipsis={true}>
                        {item.name}
                      </TextView>
                      <TextView bold={true} ellipsis={true}>
                        {item.email}
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
            </View>
          </PagerView>
        </Animated.View>

        {/* </Animated.View> */}

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
