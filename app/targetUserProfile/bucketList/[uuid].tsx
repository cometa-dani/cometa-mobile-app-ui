import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { View, useColors } from '../../../components/Themed';
import { useInfiniteQueryGetLikedEventsForBucketListByTargerUser } from '../../../queries/targetUser/eventHooks';
import { Stack, useLocalSearchParams } from 'expo-router';
import { EventsFlashList } from '../../../components/eventsFlashList/eventsFlashList';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../../../queries/queryKeys';
import { GetDetailedUserProfile } from '../../../models/User';
import { CustomHeader } from '../../../components/customHeader/customHeader';


export default function BucketListScreen(): JSX.Element {
  // colors
  const { background } = useColors();

  const { uuid: targetUserUuid, eventId } = useLocalSearchParams<{ uuid: string, eventId: string }>();
  const queryClient = useQueryClient();
  const targetUserProfileCached = queryClient.getQueryData<GetDetailedUserProfile>([QueryKeys.GET_TARGET_USER_INFO_PROFILE, targetUserUuid]);

  // events & function to handle fetching more events when reaching the end
  const { data, isFetching, fetchNextPage, hasNextPage, isLoading } = useInfiniteQueryGetLikedEventsForBucketListByTargerUser(targetUserProfileCached?.id);

  // const memoizedEventsList = useMemo(() => data?.pages.flatMap(page => page.events) || [], [data?.pages]);
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>

      <Stack.Screen
        options={{
          presentation: 'modal',
          animation: 'default',
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
          items={data?.pages.flatMap(page => page.events.filter(event => event?.id !== +eventId)) || []}
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
    marginBottom: 30,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 0
  },
});
