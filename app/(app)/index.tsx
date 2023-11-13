import React, { FC, useState } from 'react';
import { LikedEvent, CreateEventLike } from '../../models/Event';
import { StyleSheet, Image, DimensionValue, Pressable, SafeAreaView } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { GestureDetector, Gesture, FlatList, Directions } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useInfiniteQueryGetLatestEvents, useMutationLikeOrDislikeEvent } from '../../queries/eventHooks';
import { UseMutationResult } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';


// Define the props for the memoized list item
interface ListItemProps {
  item: LikedEvent,
  layoutHeight: DimensionValue,
  red100: string,
  tabIconDefault: string,
  likeOrDislikeMutation: UseMutationResult<CreateEventLike | null, Error, number, void>
}

const EventItem: FC<ListItemProps> = ({ item, likeOrDislikeMutation, layoutHeight, red100, tabIconDefault }) => {

  // can be lifted to the parent component like before
  const swipeLeft = Gesture.Fling();
  swipeLeft
    .direction(Directions.LEFT)
    .onStart(() => router.push('/bucketList'));

  const doubleTap = Gesture.Tap();
  doubleTap
    .numberOfTaps(2)
    .onEnd(() => likeOrDislikeMutation.mutate(item.id));

  return (
    <GestureDetector gesture={swipeLeft}>
      <View style={{
        alignItems: 'center',
        height: layoutHeight,
        justifyContent: 'center',
        width: '100%',
      }}>
        {/* Background image */}
        <GestureDetector gesture={doubleTap}>
          <Image
            source={{ uri: item.mediaUrl }}
            style={{ width: '100%', height: '100%' }}
          />
        </GestureDetector>
        {/* Event title */}
        <Text lightColor='#fff' darkColor='#eee' style={styles.title}>{item.name}</Text>

        {/* Positioned buttons */}
        <View lightColor='transparent' darkColor='transparent' style={styles.positionedButtons}>
          <Pressable onPress={() => likeOrDislikeMutation.mutate(item.id)}>
            {({ hovered, pressed }) => (
              (item.isLiked) ? (
                <FontAwesome name='heart' size={34} style={{ color: (hovered && pressed) ? tabIconDefault : red100 }} />
              ) : (
                <FontAwesome name='heart-o' size={34} style={{ color: (hovered && pressed) ? red100 : tabIconDefault }} />
              )
            )}
          </Pressable>
          <Pressable>
            {() => (
              <FontAwesome name='commenting-o' size={34} style={{ color: tabIconDefault }} />
            )}
          </Pressable>
          <Pressable>
            {() => (
              <FontAwesome name='share-square-o' size={34} style={{ color: tabIconDefault }} />
            )}
          </Pressable>
          <Pressable>
            {() => (
              <View
                style={{
                  borderRadius: 100,
                  aspectRatio: 1,
                  width: 34,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  borderWidth: 3.4,
                  borderColor: tabIconDefault
                }}>
                <FontAwesome name='chevron-down' size={22} style={{ color: tabIconDefault }} />
              </View>
            )}
          </Pressable>
        </View>
        {/* Positioned buttons /*}

      {/* Organizer icon */}
        <View lightColor='transparent' darkColor='transparent' style={styles.organizerContainer}>
          <Image style={styles.img} source={{ uri: item.organization.mediaUrl }} />
          <Text
            lightColor='#fff'
            darkColor='#eee'
            style={styles.organizer}>
            {item.organization.name}
          </Text>
        </View>
      </View>
    </GestureDetector>
  );
};

// function arePropsEqual(prevProps: ListItemProps, nextProps: ListItemProps): boolean {
//   // Implement your custom comparison logic here
//   // Return true if the props are equal, return false if they are not
//   return (
//     // prevProps.red100 === nextProps.red100 &&
//     // prevProps.tabIconDefault === nextProps.tabIconDefault &&
//     prevProps.item.isLiked === nextProps.item.isLiked &&
//     prevProps.layoutHeight === nextProps.layoutHeight &&
//     prevProps.likeOrDislikeMutation === nextProps.likeOrDislikeMutation
//   );
// }

// const MemoizedEventItem = React.memo(EventItem, arePropsEqual);


export default function HomeScreen(): JSX.Element {
  // Get access to colors and store data
  const { red100, tabIconDefault } = useColors();

  // events & function to handle fetching more events when reaching the end
  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQueryGetLatestEvents();
  const handleInfititeFetch = () => !isFetching && hasNextPage && fetchNextPage();

  // perform mutations
  const likeOrDislikeMutation = useMutationLikeOrDislikeEvent();

  // State variables to manage page and item heights
  const [layoutHeight, setLayoutHeight] = useState<DimensionValue>('100%');

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <StatusBar style={'auto'} />

      <View style={styles.container}>
        {/* Latest events list */}
        <FlatList
          pagingEnabled={true}
          // maxToRenderPerBatch={3}
          onLayout={(e) => setLayoutHeight(e.nativeEvent.layout.height)}
          data={data?.pages.flatMap(page => page.events)}
          contentContainerStyle={styles.flatListContent}
          onEndReached={handleInfititeFetch}
          onEndReachedThreshold={1}
          renderItem={({ item }) => (
            <EventItem
              likeOrDislikeMutation={likeOrDislikeMutation}
              key={item.id}
              item={item}
              layoutHeight={layoutHeight}
              red100={red100}
              tabIconDefault={tabIconDefault}
            />
          )}
        />
        {/* Latest events list */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  flatListContent: {
    flexGrow: 1,
  },

  img: {
    aspectRatio: 1,
    borderRadius: 50,
    height: 48,
    overflow: 'hidden'
  },

  organizer: {
    fontSize: 20,
  },

  organizerContainer: {
    alignItems: 'center',
    bottom: 30,
    flexDirection: 'row',
    gap: 12,
    left: 20,
    position: 'absolute'
  },

  positionedButtons: {
    alignItems: 'center',
    bottom: 30,
    gap: 24,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
  },

  title: {
    // Title color should come from the backend
    fontSize: 30,
    position: 'absolute',
    textAlign: 'center',
    top: 40
  }
});
