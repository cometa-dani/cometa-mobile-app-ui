import { FC, memo, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useInfiniteQueryGetLatestLikedEvents, useMutationLikeOrDislikeEvent } from '../../queries/eventHooks';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { View, Text } from '../../components/Themed';
import { GetAllLikedEventsWithPagination } from '../../models/LikedEvent';
import { QueryKeys } from '../../queries/queryKeys';
import ContentLoader, { Rect } from 'react-content-loader/native';


const SkeletonLoader = () => (
  <ContentLoader
    speed={2}
    width={400}
    height={160}
    viewBox="0 0 400 160"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <Rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
    <Rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
    <Rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
    <Rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
    <Rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
  </ContentLoader>
);


const renderItem = ({ item }: { item: GetAllLikedEventsWithPagination['events'][0] }) => {
  return (
    <>
      <MemoizedEventItem
        key={item.id}
        item={item}
      />
      <View style={{ height: 20 }} />
    </>
  );
};

export default function BuckectListScreen(): JSX.Element {
  const { data, isFetching, hasNextPage, fetchNextPage, isLoading, } = useInfiniteQueryGetLatestLikedEvents();
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();
  const eventsData = useMemo(() => data?.pages.flatMap(page => page.events) || [], [data?.pages]);

  // console.log(eventsData.length);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={'auto'} />

      <View style={styles.container}>
        {isLoading ?
          <SkeletonLoader />
          : (
            <FlashList
              data={eventsData}
              pagingEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 26 }}
              // onEndReached={handleInfiniteFetch}
              onMomentumScrollEnd={handleInfiniteFetch}
              onEndReachedThreshold={1}
              estimatedItemSize={100}
              renderItem={renderItem}
            />
          )}
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
    gap: -11,
    justifyContent: 'flex-start',
  },

  container: {
    flex: 1,
    // gap: 40,
  },

  date: {
    color: 'gray',
    fontSize: 14,
    textAlign: 'center'
  },

  eventContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 10
  },

  img: {
    borderRadius: 26,
    height: 108,
    width: '40%',
  },

  textContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '34%',
  },

  title: {
    fontWeight: '500',
    textAlign: 'center',
  }
});


interface Props {
  item: GetAllLikedEventsWithPagination['events'][0],
}
const LikedEventItem: FC<Props> = ({ item }) => {
  const queryClient = useQueryClient();

  const likeOrDislikeMutation = useMutationLikeOrDislikeEvent();

  const handleDislikeMutation = (itemID: number): void => {
    likeOrDislikeMutation.mutate(itemID, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_LIKED_EVENTS] });
      }
    });
  };

  const offset = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .cancelsTouchesInView(true)
    .onBegin(() => {
      // pressed.value = true;
    })
    .onChange((event) => {
      offset.value = event.translationX;
    })
    .onFinalize((event) => {
      const currentDistance = event.translationX;
      if (Math.abs(currentDistance) > 90) {
        let newDistance!: number;
        if (Math.sign(currentDistance) < 0) {
          newDistance = offset.value - 300;
        }
        if (Math.sign(currentDistance) > 0) {
          newDistance = offset.value + 300;
        }

        offset.value = withTiming(newDistance, { duration: 240 }, (finished) => {
          if (finished)
            runOnJS(() => handleDislikeMutation(item.id))();
        });
      }
      else {
        offset.value = withSpring(0);
      }
    });


  const animatedStyles = useAnimatedStyle(() => {
    return ({
      transform: [
        { translateX: offset.value },
        // { scale: withTiming(pressed.value ? 1.18 : 1) },
      ],
      // backgroundColor: pressed.value ? '#FFE04B' : '#b58df1',
    });
  }, []);


  return (
    <Pressable key={item.id} onPress={() => router.push(`/${item.id}`)}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.eventContainer, animatedStyles]}>
          <Image placeholder={'L39HdjPsUhyE05m0ucW,00lTm]R5'} style={styles.img} source={{ uri: item.mediaUrl }} />

          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.name}</Text>

            <Text style={styles.date}>{new Date(item.date).toDateString()}</Text>
          </View>

          <View style={styles.bubblesContainer}>
            {item.likes.slice(0, 3).map(({ user }) => (
              <Image placeholder={'L39HdjPsUhyE05m0ucW,00lTm]R5'} key={user.id} source={{ uri: user.avatar }} style={styles.bubble} />
            ))}
          </View>
        </Animated.View>
      </GestureDetector>
    </Pressable>
  );
};

const MemoizedEventItem = memo(LikedEventItem, areEqual);

function areEqual(prevProps: Props, nextProps: Props) {
  return prevProps.item.id === nextProps.item.id;
}
