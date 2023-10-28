import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { FlatList } from 'react-native-gesture-handler';
import { useInfiniteLikedEvents } from '../queries/eventQuery';
import { Image } from 'react-native-animatable';


export default function BuckectListScreen(): JSX.Element {

  const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteLikedEvents();

  return (
    <>
      <StatusBar style={'auto'} />

      <View style={styles.container}>

        <FlatList
          pagingEnabled={false}
          data={data?.pages.flatMap(page => page.events)}
          contentContainerStyle={styles.flatListContent}
          onEndReached={() => !isFetching && hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.2}
          renderItem={({ item }) => (
            <View style={styles.eventContainer}>
              <Image style={styles.img} source={{ uri: item.mediaUrl }} />

              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.name}</Text>

                <Text style={styles.date}>{new Date(item.date).toDateString()}</Text>
              </View>
            </View>
          )}
        />

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  date: {
    color: 'gray',
    textAlign: 'center'
  },

  eventContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
  },

  flatListContent: {
    gap: 40,
    paddingHorizontal: 24,
    paddingVertical: 34,
  },

  img: {
    borderRadius: 26,
    flex: 0.5,
    height: 128
  },

  textContainer: {
    flex: 0.5,
    justifyContent: 'space-around'
  },

  title: {
    fontSize: 18,
    textAlign: 'center',
  }
});
