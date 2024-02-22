import React, { useMemo } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { View, useColors } from '../../../components/Themed';
import { useInfiniteQueryGetMatchedEventsBySameUsers } from '../../../queries/eventHooks';
import { Stack, useLocalSearchParams } from 'expo-router';
import { EventsFlashList } from '../../../components/events/eventsList';
import { useQueryClient } from '@tanstack/react-query';
import { GetDetailedUserProfile } from '../../../models/User';
import { QueryKeys } from '../../../queries/queryKeys';
import { useQueryGetUserProfileByUid } from '../../../queries/userHooks';
import { useCometaStore } from '../../../store/cometaStore';
import { CustomHeader } from '../../../components/customHeader/customHeader';


export default function MatchedEventsListScreen(): JSX.Element {
  // colors
  const { background } = useColors();
  const authenticatedUserUuid = useCometaStore(state => state.uid);

  const anotherUserUuid = useLocalSearchParams<{ uuid: string }>()['uuid'];
  const queryClient = useQueryClient();
  const friendQueryData = queryClient.getQueryData<GetDetailedUserProfile>([QueryKeys.GET_NEW_PEOPLE_INFO_PROFILE, anotherUserUuid]);
  const { data: authUserData } = useQueryGetUserProfileByUid(authenticatedUserUuid);

  // events & function to handle fetching more events when reaching the end
  const { data, isFetching, fetchNextPage, hasNextPage, isLoading } = useInfiniteQueryGetMatchedEventsBySameUsers(anotherUserUuid);
  const eventsData = useMemo(() => data?.pages.flatMap(page => page.events) || [], [data?.pages]);

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
              user1={authUserData?.photos[0]}
              user2={friendQueryData?.photos[0]}
            />
          )
        }}
      />

      <View style={styles.container}>
        <EventsFlashList
          hideLikeButton={true}
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
  },
});
