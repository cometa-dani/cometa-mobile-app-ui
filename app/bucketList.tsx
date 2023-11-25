import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, SafeAreaView, Image } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { Text, View } from '../components/Themed';
import { FlatList, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useInfiniteQueryGetLatestLikedEvents } from '../queries/eventHooks';
import { router } from 'expo-router';
import { FC } from 'react';
import { GetAllLikedEventsWithPagination } from '../models/LikedEvent';


interface Props {
  item: GetAllLikedEventsWithPagination['events'][0]
}
const LikedEventItem: FC<Props> = ({ item }) => {
  const pressed = useSharedValue(false);
  const offset = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      // pressed.value = true;
    })
    .onChange((event) => {
      offset.value = event.translationX;
    })
    .onFinalize((event) => {
      const distance = event.translationX;
      if (Math.abs(distance) > 90) {
        if (Math.sign(distance) < 0) {
          offset.value -= 300;
        }
        if (Math.sign(distance) > 0) {
          offset.value += 300;
        }

        // TODO: delelete from DB
      }
      else {
        offset.value = withSpring(0);
        // pressed.value = false;
      }
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: offset.value },
      // { scale: withTiming(pressed.value ? 1.18 : 1) },
    ],
    // backgroundColor: pressed.value ? '#FFE04B' : '#b58df1',
  }));

  return (
    <Pressable key={item.id} onPress={() => router.push(`/${item.id}`)}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.eventContainer, animatedStyles]}>
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
        </Animated.View>
      </GestureDetector>
    </Pressable>
  );
};

export default function BuckectListScreen(): JSX.Element {
  const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteQueryGetLatestLikedEvents();
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();
  // Animated.
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={'auto'} />

      <View style={styles.container}>
        <FlatList
          data={data?.pages.flatMap(page => page.events) || []}
          pagingEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          onEndReached={handleInfiniteFetch}
          onEndReachedThreshold={0.2}
          renderItem={({ item }) => (
            <LikedEventItem key={item.id} item={item} />
          )}
        />
      </View>
    </SafeAreaView>
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
    fontSize: 14,
    textAlign: 'center'
  },

  eventContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
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
    flexDirection: 'column',
    justifyContent: 'space-around',
  },

  title: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  }
});
