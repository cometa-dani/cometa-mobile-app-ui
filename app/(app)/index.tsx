import React, { FC } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { useInfiniteQueryGetLatestEventsByLoggedInUser } from '../../queries/loggedInUser/eventHooks';
import { EventsFlashList } from '../../components/eventsFlashList/eventsFlashList';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { If } from '../../components/utils';
import { gray_900 } from '../../constants/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { router } from 'expo-router';


export default function HomeScreen(): JSX.Element {
  // colors
  const { background } = useColors();
  // eventsData
  const { data, isFetching, fetchNextPage, hasNextPage, isLoading, isRefetching } = useInfiniteQueryGetLatestEventsByLoggedInUser();
  const evenstData = data?.pages.flatMap(page => page.events) || [];

  // handling fetch when reaching the end
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <View style={styles.container}>
        <If
          condition={!evenstData?.length && !isLoading}
          render={(
            <NotEventsFound />
          )}
          elseRender={(
            <EventsFlashList
              items={evenstData}
              isLoading={isLoading || isRefetching}
              onInfiniteScroll={handleInfiniteFetch}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}


const NotEventsFound: FC = () => (
  <View style={styles.notFoundContainer}>
    <Text style={{ fontWeight: '600', fontSize: 20 }}>No events found</Text>

    <TouchableOpacity
      style={{ alignItems: 'center' }}
      onPress={() => router.push('/settings')}
    >
      <MaterialCommunityIcons
        name="checkbox-marked-circle-plus-outline"
        size={34}
        color={gray_900}
      />
      <Text style={{ fontSize: 14, marginTop: 6 }}>Change Settings</Text>
    </TouchableOpacity>
  </View>
);


const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 10,
    overflow: 'hidden',
  },

  notFoundContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 26 },
});
