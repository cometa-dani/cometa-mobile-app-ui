import React, { useMemo } from 'react';
import { StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { View, useColors } from '../../../components/Themed';
import { useInfiniteQueryGetMatchedEventsBySameUsers } from '../../../queries/eventHooks';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { EventsFlashList } from '../../../components/events/eventsList';
import { useQueryClient } from '@tanstack/react-query';
import { GetDetailedUserProfile } from '../../../models/User';
import { QueryKeys } from '../../../queries/queryKeys';
import { useQueryGetUserProfileByUid } from '../../../queries/userHooks';
import { useCometaStore } from '../../../store/cometaStore';
import { Image } from 'expo-image';
import { blue_100, red_100 } from '../../../constants/colors';


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
          headerShown: false,
          headerShadowVisible: false,
          headerTitle: '',
        }}
      />

      <View style={{ height: 70 }} />

      <Pressable
        style={{
          position: 'absolute',
          top: 32,
          zIndex: 1000,
          alignSelf: 'center',
          flexDirection: 'row',
          gap: -20
        }}
        onPress={() => router.back()}>
        <Image
          style={{
            borderColor: red_100,
            borderWidth: 3.6,
            width: 76,
            height: 76,
            borderRadius: 50,
          }}
          placeholder={{ thumbhash: authUserData?.photos[0].placeholder }}
          source={{ uri: authUserData?.photos[0].url }}
        />
        <Image
          style={{
            borderColor: blue_100,
            borderWidth: 3.6,
            width: 76,
            height: 76,
            borderRadius: 50,
          }}
          placeholder={{ thumbhash: friendQueryData?.photos[0].placeholder }}
          source={{ uri: friendQueryData?.photos[0].url }}
        />
      </Pressable>

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
