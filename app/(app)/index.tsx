import React, { useMemo } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { View, useColors } from '../../components/Themed';
import { useInfiniteQueryGetLatestEventsByLoggedInUser } from '../../queries/eventHooks';
import { EventsFlashList } from '../../components/events/eventsList';


export default function HomeScreen(): JSX.Element {
  // colors
  const { background } = useColors();

  // eventsData
  const { data, isFetching, fetchNextPage, hasNextPage, isLoading } = useInfiniteQueryGetLatestEventsByLoggedInUser();
  const loggedInUserLatestEventsList = useMemo(() => data?.pages.flatMap(page => page.events) || [], [data?.pages]);

  // handling fetch when reaching the end
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <View style={styles.container}>

        <EventsFlashList
          items={loggedInUserLatestEventsList}
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
    marginHorizontal: 10,
    overflow: 'hidden',
  },
});
