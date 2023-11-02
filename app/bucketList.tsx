import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { FlatList } from 'react-native-gesture-handler';
import { useInfiniteQueryGetLatestLikedEvents } from '../queries/events/hooks';
import { Image } from 'react-native-animatable';
import { router } from 'expo-router';


export default function BuckectListScreen(): JSX.Element {
  const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteQueryGetLatestLikedEvents();
  const handlingInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();

  return (
    <>
      <StatusBar style={'auto'} />

      <View style={styles.container}>
        <FlatList
          pagingEnabled={false}
          data={data?.pages.flatMap(page => page.events)}
          contentContainerStyle={styles.flatListContent}
          onEndReached={handlingInfiniteFetch}
          onEndReachedThreshold={0.2}
          renderItem={({ item }) => (
            <Pressable key={item.id} onPress={() => router.push(`/${item.id}`)}>
              <View style={styles.eventContainer}>
                <Image style={styles.img} source={{ uri: item.mediaUrl }} />

                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.name}</Text>

                  <Text style={styles.date}>{new Date(item.date).toDateString()}</Text>
                </View>

                <View style={styles.bubblesContainer}>
                  {item.likes.slice(0, 3).map(({ user }) => (
                    <Image key={user.id} source={{ uri: user.avatar }} style={styles.bubble} />
                  ))}
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({

  bubble: {
    aspectRatio: 1,
    borderRadius: 100,
    height: 30,
  },

  bubblesContainer: {
    flexDirection: 'row',
    flex: 0,
    gap: -13,
    justifyContent: 'flex-start',
  },

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
    gap: 12
  },

  flatListContent: {
    gap: 40,
    paddingHorizontal: 18,
    paddingVertical: 26,
  },

  img: {
    borderRadius: 26,
    flex: 1,
    height: 108
  },

  textContainer: {
    flex: 1,
    justifyContent: 'space-around'
  },

  title: {
    fontSize: 18,
    textAlign: 'center',
  }
});
