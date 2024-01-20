import React, { FC, Fragment, memo, useEffect, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Swipeable from 'react-native-gesture-handler/Swipeable';
// import { EntryExitTransition, CurvedTransition, JumpingTransition } from 'react-native-reanimated';

import { RectButton } from 'react-native-gesture-handler';
import { useInfiniteQueryGetLatestLikedEvents, useMutationDeleteLikedEventFromBucketList } from '../../queries/eventHooks';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { View, Text } from '../../components/Themed';
import { GetAllLikedEventsWithPagination } from '../../models/LikedEvent';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { FontAwesome } from '@expo/vector-icons';
import { gray_100, red_100 } from '../../constants/colors';


const SkeletonLoader = () => {
  const windowWidth = Dimensions.get('window').width;
  const itemWidth = windowWidth - 40; // Subtract padding
  const itemHeight = 108;
  const gap = 20;
  const totalHeight = 6 * (itemHeight + gap);

  const rect1Width = itemWidth * 0.40; // 35% of item width
  const rect2Width = itemWidth * 0.60; // 51% of item width
  const rect2X = rect1Width + 20; // Start of second rect, add 20 for gap

  return (
    <ContentLoader
      speed={1}
      style={{ marginVertical: 26 }}
      width={windowWidth}
      height={totalHeight}
      viewBox={`0 0 ${windowWidth} ${totalHeight}`}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Fragment key={i}>
          <Rect
            x="20"
            y={i * (itemHeight + gap) + 6}
            rx="26"
            ry="26"
            width={rect1Width}
            height={itemHeight}
          />
          <Rect
            x={rect2X + 10}
            y={i * (itemHeight + gap) + 6}
            rx="26"
            ry="26"
            width={rect2Width - 10}
            height={itemHeight}
          />
        </Fragment>
      ))}
    </ContentLoader>
  );
};


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

  const fadeAnim = useSharedValue(1);  // Initial value for opacity: 1
  const contentOpacity = useSharedValue(0);  // Initial value for opacity: 0

  useEffect(() => {
    if (!isLoading) {
      fadeAnim.value = withTiming(0, { duration: 300 });
      contentOpacity.value = withTiming(1, { duration: 300 });
    }
  }, [isLoading]);

  const transitionStyles = useAnimatedStyle(() => {
    return {
      opacity: isLoading ? fadeAnim.value : contentOpacity.value,
    };
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar style={'auto'} />

      <Animated.View style={[styles.container, transitionStyles]}>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <FlashList
            data={eventsData}
            pagingEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 26 }}
            // ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            onMomentumScrollEnd={handleInfiniteFetch}
            onEndReachedThreshold={1}
            estimatedItemSize={100}
            renderItem={renderItem}
          />
        )}
      </Animated.View>
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
    backgroundColor: '#fff',
    flex: 1,
  },

  date: {
    color: 'gray',
    fontSize: 14,
    textAlign: 'center'
  },

  deleteButton: {
    backgroundColor: gray_100,
    borderRadius: 20,
    justifyContent: 'center',
    marginRight: 20,
    padding: 24
  },

  eventContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
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
  const deleteLikedEventMutation = useMutationDeleteLikedEventFromBucketList();

  return (
    <Swipeable renderRightActions={
      () => (
        <RectButton onPress={() => deleteLikedEventMutation.mutate(item.id)} style={styles.deleteButton}>
          <FontAwesome name='trash-o' size={32} color={red_100} />
        </RectButton>
      )
    }>
      <Pressable onPress={() => router.push(`/${item.id}`)}>
        {({ pressed }) => (
          <View style={[styles.eventContainer, { opacity: pressed ? 0.8 : 1 }]}>
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
          </View>
        )}
      </Pressable>
    </Swipeable>
  );
};

const MemoizedEventItem = memo(LikedEventItem, areEqual);

function areEqual(prevProps: Props, nextProps: Props) {
  return prevProps.item.id === nextProps.item.id;
}
