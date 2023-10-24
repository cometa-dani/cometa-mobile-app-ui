import React, { FC, useEffect, useState } from 'react';
import { Event } from '../../models/Event';
import { StyleSheet, Image, DimensionValue, Pressable } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { useCometaStore } from '../../store/cometaStore';
import { selectActions } from '../../store/selectors';
import { GestureDetector, Gesture, FlatList, Directions, FlingGesture } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';


// Define the props for the memoized list item
interface ListItemProps {
  item: Event,
  swipeLeft: FlingGesture,
  layoutHeight: DimensionValue,
  red100: string,
  tabIconDefault: string,
}

const EventItem: FC<ListItemProps> = ({ item, swipeLeft, layoutHeight, red100, tabIconDefault }) => (
  <GestureDetector gesture={swipeLeft}>
    <View style={{
      alignItems: 'center',
      height: layoutHeight,
      justifyContent: 'center',
      width: '100%',
    }}>
      {/* Background image */}
      <Image
        source={{ uri: item.mediaUrl }}
        style={{ width: '100%', height: '100%' }}
      />
      {/* Event title */}
      <Text lightColor='#fff' darkColor='#eee' style={styles.title}>{item.name}</Text>

      {/* Positioned buttons */}
      <View lightColor='transparent' darkColor='transparent' style={styles.positionedButtons}>
        <Pressable>
          {({ pressed }) => (
            <FontAwesome name='heart' size={46} style={{ color: pressed ? red100 : tabIconDefault }} />
          )}
        </Pressable>
        <Pressable>
          {() => (
            <FontAwesome name='commenting' size={46} style={{ color: tabIconDefault }} />
          )}
        </Pressable>
        <Pressable onPress={() => router.push('/(onboarding)/register')}>
          {() => (
            <FontAwesome name='send' size={46} style={{ color: tabIconDefault }} />
          )}
        </Pressable>
        <Pressable>
          {() => (
            <FontAwesome name='chevron-down' size={46} style={{ color: tabIconDefault }} />
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

function arePropsEqual(prevProps: ListItemProps, nextProps: ListItemProps): boolean {
  // Implement your custom comparison logic here
  // Return true if the props are equal, return false if they are not
  return (
    prevProps.item === nextProps.item &&
    prevProps.layoutHeight === nextProps.layoutHeight &&
    prevProps.red100 === nextProps.red100 &&
    prevProps.tabIconDefault === nextProps.tabIconDefault
  );
}

const MemoizedEventItem = React.memo(EventItem, arePropsEqual);


export default function HomeScreen(): JSX.Element {
  // Get access to colors and store data
  const { red100, tabIconDefault } = useColors();

  const { data } = useCometaStore(state => state.events);
  const { fetchEventsOnce, fetchMoreEvents } = useCometaStore(selectActions);

  // State variables to manage page and item heights
  const [layoutHeight, setLayoutHeight] = useState<DimensionValue>('100%');
  const [page, setPage] = useState(1);

  // Gesture for left swipe action
  const swipeLeft = Gesture.Fling();

  swipeLeft
    .direction(Directions.LEFT)
    .onStart(() => router.push('/bucketList'));

  // Function to handle fetching more events when reaching the end
  const handleEndReached = (): void => {
    // Check if there are more events to fetch
    const fetchEvents = data || [];
    if (fetchEvents.events.length < fetchEvents.totalEvents) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMoreEvents(nextPage).then();
    }
  };

  // Initial data fetch when the component mounts
  useEffect(() => {
    fetchEventsOnce().then();
  }, []);


  return (
    <View style={styles.container}>
      {/* Latest events list */}
      <FlatList
        pagingEnabled={true}
        // initialNumToRender={0}
        onLayout={(e) => setLayoutHeight(e.nativeEvent.layout.height)}
        data={data.events}
        contentContainerStyle={styles.flatListContent}
        onEndReached={handleEndReached}
        onEndReachedThreshold={1}
        renderItem={({ item }) => (
          <MemoizedEventItem
            item={item}
            layoutHeight={layoutHeight}
            red100={red100}
            swipeLeft={swipeLeft}
            tabIconDefault={tabIconDefault}
          />
        )}
      />
      {/* Latest events list */}
    </View>
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
    borderRadius: 50,
    height: 60,
    overflow: 'hidden',
    width: 60,
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
    bottom: 30,
    gap: 20,
    position: 'absolute',
    right: 20
  },

  title: {
    // Title color should come from the backend
    fontSize: 30,
    position: 'absolute',
    textAlign: 'center',
    top: 40
  }
});
