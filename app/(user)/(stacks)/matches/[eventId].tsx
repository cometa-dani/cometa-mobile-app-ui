import React, { ReactNode, useReducer, useState } from 'react';
import { Image, SafeAreaView, View, } from 'react-native';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useInfiteQueryGetUsersWhoLikedSameEventByID } from '@/queries/targetUser/eventHooks';
import { IGetPaginatedLikedEventsBucketList } from '@/models/LikedEvent';
import { QueryKeys } from '@/queries/queryKeys';
import { useInfiniteQueryGetLoggedInUserNewestFriends } from '@/queries/currentUser/friendshipHooks';
import { GradientHeading } from '@/components/text/gradientText';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { TextView } from '@/components/text/text';
import PagerView, { usePagerView } from 'react-native-pager-view';
import { HStack, VStack } from '@/components/utils/stacks';
import { useCometaStore } from '@/store/cometaStore';
import { Button } from '@/components/button/button';


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
  const { ref, setPage } = usePagerView();
  const [step, setStep] = useState(0);
  const { eventId } = useGlobalSearchParams<{ eventId: string }>();
  // const eventLike = useQueryCachedBucketListItem(+eventIndex);
  const likedEvent = useCometaStore(state => state.likedEvent);
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

  return (
    <>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            autoFocus: false,
            placeholder: 'search',
            tintColor: theme.colors.red100,
            inputType: 'text',
            barTintColor: theme.colors.white80
          },
          animation: 'default',
          gestureDirection: 'horizontal',
          fullScreenGestureEnabled: true,
          headerTitleAlign: 'center',
          contentStyle: { backgroundColor: theme.colors.white80 },
          headerTitle: () => (
            <GradientHeading styles={[{ fontSize: theme.text.size.s8 }]}>
              matches
            </GradientHeading>
          ),
        }}
      />

      <SafeAreaView style={{ flex: 1, gap: theme.spacing.sp4 }}>
        <View style={{ padding: theme.spacing.sp6, paddingBottom: 0 }}>
          <Image
            resizeMode='cover'
            style={styles.imgHeader}
            source={{ uri: likedEvent.photos.at(0)?.url, }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: theme.spacing.sp4,
            padding: theme.spacing.sp2,
            marginHorizontal: theme.spacing.sp6,
            borderRadius: 20,
            backgroundColor: theme.colors.white60
          }}
        >
          <Button
            style={{ flex: 1 }}
            onPress={() => { setPage(0); setStep(0); }}
            variant={step === 1 ? 'disabled' : 'primary'}
          >
            New Friends
          </Button>
          <Button
            style={{ flex: 1 }}
            onPress={() => { setPage(1); setStep(1); }}
            variant={step === 1 ? 'primary' : 'disabled'}
          >
            New People
          </Button>
        </View>

        <PagerView
          ref={ref}
          style={{ height: '100%', width: '100%' }}
          initialPage={0}
        >
          <View key={0} style={{ flex: 1, height: '100%' }}>
            <FlashList
              nestedScrollEnabled={true}
              data={users}
              estimatedItemSize={60}
              ListFooterComponentStyle={{ height: 500 }}
              ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp6 }} />}
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
              ListFooterComponentStyle={{ height: 500 }}
              ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp6 }} />}
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
