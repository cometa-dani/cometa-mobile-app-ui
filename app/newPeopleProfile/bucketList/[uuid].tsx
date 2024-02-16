import React, { useMemo } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { View, useColors } from '../../../components/Themed';
import { useInfiniteQueryGetLikedEventsByUserId } from '../../../queries/eventHooks';
import { Stack, useLocalSearchParams } from 'expo-router';
import { EventsFlashList } from '../../../components/events/eventsList';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../../../queries/queryKeys';
import { GetDetailedUserProfile } from '../../../models/User';
import { Image } from 'expo-image';
import { red_100 } from '../../../constants/colors';


export default function BucketListScreen(): JSX.Element {
  // colors
  const { background } = useColors();

  const uuid = useLocalSearchParams<{ uuid: string }>()['uuid'];
  const queryClient = useQueryClient();
  const queryData = queryClient.getQueryData<GetDetailedUserProfile>([QueryKeys.GET_NEW_PEOPLE_INFO_PROFILE, uuid]);

  // events & function to handle fetching more events when reaching the end
  const { data, isFetching, fetchNextPage, hasNextPage, isLoading } = useInfiniteQueryGetLikedEventsByUserId(queryData?.id);
  const eventsData = useMemo(() => data?.pages.flatMap(page => page.events) || [], [data?.pages]);

  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>

      <Stack.Screen
        options={{
          // contentStyle: { backgroundColor: 'transparent', zIndex: -1, position: 'relative' },
          presentation: 'modal',
          animation: 'default',
          headerShown: false,
          // headerTransparent: true,
          // headerBackground() {
          //   return <View style={{ height: 100, zIndex: -1 }} />;
          // },
          headerShadowVisible: false,
          headerTitle: '',
          headerStyle: { backgroundColor: 'rgba(0, 0, 0, 0)' }
        }}
      />

      <View style={{ height: 70 }} />

      <Image
        style={{
          borderColor: red_100,
          borderWidth: 3.6,
          width: 76,
          height: 76,
          borderRadius: 50,
          position: 'absolute',
          top: 32,
          zIndex: 1000,
          alignSelf: 'center'
        }}
        placeholder={{ thumbhash: queryData?.photos[0].placeholder }}
        source={{ uri: queryData?.photos[0].url }}
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
