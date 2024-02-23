import React, { useMemo } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { View, useColors } from '../../../components/Themed';
import { useInfiniteQueryGetSameMatchedEventsByTwoUsers } from '../../../queries/eventHooks';
import { Stack, useLocalSearchParams } from 'expo-router';
import { EventsFlashList } from '../../../components/events/eventsList';
import { useQueryClient } from '@tanstack/react-query';
import { GetDetailedUserProfile } from '../../../models/User';
import { QueryKeys } from '../../../queries/queryKeys';
import { useQueryGetLoggedInUserProfileByUid } from '../../../queries/userHooks';
import { useCometaStore } from '../../../store/cometaStore';
import { CustomHeader } from '../../../components/customHeader/customHeader';


export default function MatchedEventsListScreen(): JSX.Element {
  // colors
  const { background } = useColors();
  const loggedInUserUuid = useCometaStore(state => state.uid);

  const targetUserUuid = useLocalSearchParams<{ uuid: string }>()['uuid'];
  const queryClient = useQueryClient();
  const targetUserProfileCached = queryClient.getQueryData<GetDetailedUserProfile>([QueryKeys.GET_TARGET_USER_INFO_PROFILE, targetUserUuid]);
  const { data: loggedInUserProfile } = useQueryGetLoggedInUserProfileByUid(loggedInUserUuid);

  // events & function to handle fetching more events when reaching the end
  const { data, isFetching, fetchNextPage, hasNextPage, isLoading } = useInfiniteQueryGetSameMatchedEventsByTwoUsers(targetUserUuid);
  const matchedEventsData = useMemo(() => data?.pages.flatMap(page => page.events) || [], [data?.pages]);

  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <Stack.Screen
        options={{
          presentation: 'modal',
          animation: 'default',
          headerShown: true,
          header: () => (
            <CustomHeader
              user1={loggedInUserProfile?.photos[0]}
              user2={targetUserProfileCached?.photos[0]}
            />
          )
        }}
      />

      <View style={styles.container}>
        <EventsFlashList
          hideLikeButton={true}
          items={matchedEventsData}
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
  },
});
