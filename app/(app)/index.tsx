import React, { useMemo } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { View, useColors } from '../../components/Themed';
import { useInfiniteQueryGetLatestEvents } from '../../queries/eventHooks';
import { EventsList } from '../../components/events/eventsList';


export default function HomeScreen(): JSX.Element {
  // colors
  const { background } = useColors();

  // events & function to handle fetching more events when reaching the end
  const { data, isFetching, fetchNextPage, hasNextPage, isLoading } = useInfiniteQueryGetLatestEvents();
  const eventsData = useMemo(() => data?.pages.flatMap(page => page.events) || [], [data?.pages]);

  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <View style={styles.container}>

        <EventsList
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
    marginHorizontal: 10,
    overflow: 'hidden',
  },
});
