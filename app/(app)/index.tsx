import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { View, useColors } from '../../components/Themed';
import { useInfiniteQueryGetLatestEventsByLoggedInUser } from '../../queries/loggedInUser/eventHooks';
import { EventsFlashList } from '../../components/eventsFlashList/eventsFlashList';


export default function HomeScreen(): JSX.Element {
  // colors
  const { background } = useColors();

  // eventsData
  const { data, isFetching, fetchNextPage, hasNextPage, isLoading } = useInfiniteQueryGetLatestEventsByLoggedInUser();

  // handling fetch when reaching the end
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <View style={styles.container}>

        <EventsFlashList
          items={data?.pages.flatMap(page => page.events) || []}
          isLoading={isLoading}
          onInfiniteScroll={handleInfiniteFetch}
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
