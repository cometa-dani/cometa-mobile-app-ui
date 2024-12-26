import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { View, useColors } from '../../../../legacy_components/Themed';
import { useInfiniteQueryGetLikedEventsForBucketListByTargerUser } from '../../../../queries/targetUser/eventHooks';
import { Stack, useLocalSearchParams } from 'expo-router';
import { EventsFlashList } from '../../../../legacy_components/eventsFlashList/eventsFlashList';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../../../../queries/queryKeys';
import { IGetTargetUser } from '../../../../models/User';
import { CustomHeader } from '../../../../legacy_components/customHeader/customHeader';


export default function TargetUserBucketListScreen(): JSX.Element {
  // colors
  const { background } = useColors();

  const { uuid: targetUserUuid, eventId, initialScrollIndex } = useLocalSearchParams<{ uuid: string, eventId: string, initialScrollIndex: string }>();
  const queryClient = useQueryClient();
  const targetUserProfileCached = queryClient.getQueryData<IGetTargetUser>([QueryKeys.GET_TARGET_USER_PROFILE, targetUserUuid]);

  // events & function to handle fetching more events when reaching the end
  const { data, isFetching, fetchNextPage, hasNextPage, isLoading } = useInfiniteQueryGetLikedEventsForBucketListByTargerUser(targetUserProfileCached?.id);

  // const memoizedEventsList = useMemo(() => data?.pages.flatMap(page => page.events) || [], [data?.pages]);
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>

      <Stack.Screen
        options={{
          gestureDirection: 'vertical',
          fullScreenGestureEnabled: true,
          headerShown: true,
          headerTitle: '',
          header: () => (
            <CustomHeader
              user1={targetUserProfileCached?.photos[0]}
            />
          )
        }}
      />

      <View style={styles.container}>
        <EventsFlashList
          initialScrollIndex={+initialScrollIndex}
          items={data?.pages.flatMap(page => page.items.filter(event => event?.id !== +eventId)) || []}
          isLoading={isLoading}
          onInfiniteScroll={handleInfiniteFetch}
          targetUserId={targetUserProfileCached?.id}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    flex: 1,
    margin: 10,
    marginBottom: 34,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 0
  },
});
