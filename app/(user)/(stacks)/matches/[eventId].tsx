import React, { useMemo, useState } from 'react';
import { SafeAreaView, } from 'react-native';
import { Stack, Tabs, useGlobalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useInfiteQueryGetUsersWhoLikedSameEventByID } from '@/queries/targetUser/eventHooks';
import { IGetPaginatedLikedEventsBucketList } from '@/models/LikedEvent';
import { QueryKeys } from '@/queries/queryKeys';
import { useInfiniteQueryGetLoggedInUserNewestFriends } from '@/queries/currentUser/friendshipHooks';
import { GradientHeading } from '@/components/text/gradientText';
import { useStyles } from 'react-native-unistyles';
import { TextView } from '@/components/text/text';


export default function MatchedEventsScreen(): JSX.Element {
  const { styles, theme } = useStyles();
  const { eventId, eventIndex } = useGlobalSearchParams<{ eventId: string, eventIndex: string }>();
  // cached data
  const queryClient = useQueryClient();
  const bucketListCahedData = queryClient.getQueryData<InfiniteData<IGetPaginatedLikedEventsBucketList, number>>([QueryKeys.GET_PAGINATED_LIKED_EVENTS_FOR_BUCKETLIST]);
  const eventByIdCachedData = bucketListCahedData?.pages.flatMap(page => page?.items)[+eventIndex] ?? null;

  // people state
  // const newPeopleData = useInfiteQueryGetUsersWhoLikedSameEventByID(+eventId);
  const newFriendsData = useInfiniteQueryGetLoggedInUserNewestFriends();


  const memoizedFriendsList = useMemo(() => (
    newFriendsData.data?.pages.flatMap(page => page?.friendships) ?? []
  ), [newFriendsData.data?.pages]);
  // const memoizedNewPeopleList = useMemo(() => (
  //   // newPeopleData.data?.pages.flatMap(page => page?.items) ?? []
  // ), [newPeopleData.data?.pages]);


  const handleNewPeopleInfiniteScroll = (): void => {
    // if (newPeopleData) {
    //   const { hasNextPage, isFetching, fetchNextPage } = newPeopleData;
    //   hasNextPage && !isFetching && fetchNextPage();
    // }
  };
  const handleNewFriendsInfiniteScroll = (): void => {
    if (newFriendsData) {
      const { hasNextPage, isFetching, fetchNextPage } = newFriendsData;
      hasNextPage && !isFetching && fetchNextPage();
    }
  };
  // toggling tabs
  const [toggleTabs, setToggleTabs] = useState(false); // shuould be store on phone


  return (
    <>
      <Stack.Screen
        options={{
          animation: 'default',
          gestureDirection: 'horizontal',
          fullScreenGestureEnabled: true,
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          contentStyle: { backgroundColor: theme.colors.white80 },
          headerTitle: () => (
            <GradientHeading styles={[{ fontSize: theme.text.size.s8 }]}>
              macthes
            </GradientHeading>
          ),
        }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <TextView>Hello World eventId: {eventId}</TextView>
      </SafeAreaView>
    </>
  );
}

{/* <View style={styles.screenContainer}>
        <View style={[styles.header, { paddingHorizontal: 18, paddingTop: 20 }]}>
          {eventByIdCachedData?.photos[0]?.url &&
            <HeaderImage
              style={styles.imgHeader}
              source={{ uri: eventByIdCachedData?.photos[0]?.url }}
            />
          }

          <View style={styles.tabs}>
            <TouchableOpacity onPress={() => setToggleTabs(prev => !prev)}>
              <Text size='lg' style={[styles.tab, toggleTabs && { ...styles.tabActive, color: '#83C9DD' }]}>Friends</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setToggleTabs(prev => !prev)}>
              <Text size='lg' style={[styles.tab, !toggleTabs && { ...styles.tabActive, color: '#E44063' }]}>New People</Text>
            </TouchableOpacity>
          </View>
        </View>

        <If
          condition={toggleTabs}
          render={(
            <FriendsFlashList
              onInfiniteScroll={handleNewFriendsInfiniteScroll}
              users={memoizedFriendsList}
              isFetching={newFriendsData.isPending}
              isEmpty={!newFriendsData.data?.pages[0]?.totalFriendships}
            />
          )}
          elseRender={(
            <MeetNewPeopleFlashList
              onInfiniteScroll={handleNewPeopleInfiniteScroll}
              users={memoizedNewPeopleList}
              isFetching={newPeopleData.isPending}
              isEmpty={!newPeopleData.data?.pages[0]?.totalItems}
            />
          )}
        />
      </View> */}
