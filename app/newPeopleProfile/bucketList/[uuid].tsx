import React, { useMemo } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { View, useColors } from '../../../components/Themed';
import { useInfiniteQueryGetLikedEventsByUserId } from '../../../queries/eventHooks';
import { Stack, useLocalSearchParams } from 'expo-router';
import { EventsFlashList } from '../../../components/events/eventsList';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../../../queries/queryKeys';
import { GetDetailedUserProfile } from '../../../models/User';
import { CustomHeader } from '../../../components/customHeader/customHeader';


export default function BucketListScreen(): JSX.Element {
  // colors
  const { background } = useColors();

  const anotherUserUuid = useLocalSearchParams<{ uuid: string }>()['uuid'];
  const queryClient = useQueryClient();
  const userProfileCachedData = queryClient.getQueryData<GetDetailedUserProfile>([QueryKeys.GET_NEW_PEOPLE_INFO_PROFILE, anotherUserUuid]);

  // events & function to handle fetching more events when reaching the end
  const { data, isFetching, fetchNextPage, hasNextPage, isLoading } = useInfiniteQueryGetLikedEventsByUserId(userProfileCachedData?.id);
  const eventsData = useMemo(() => data?.pages.flatMap(page => page.events) || [], [data?.pages]);

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
              user1={userProfileCachedData?.photos[0]}
            />
          )
        }}
      />

      <View style={styles.container}>
        <EventsFlashList
          items={eventsData}
          isLoading={isLoading}
          handleInfiniteFetch={handleInfiniteFetch}
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
