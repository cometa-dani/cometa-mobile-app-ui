import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { LikedEvent, } from '../../models/Event';
import { StyleSheet, Image, DimensionValue, Pressable, SafeAreaView, ViewToken, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Text, View, useColors } from '../../components/Themed';
import { GestureDetector, Gesture, Directions } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { router, } from 'expo-router';
import { useInfiniteQueryGetLatestEvents, useMutationLikeOrDislikeEvent } from '../../queries/eventHooks';
import { StatusBar } from 'expo-status-bar';
import { useCometaStore } from '../../store/cometaStore';
import { ResizeMode, Video } from 'expo-av';


export default function HomeScreen(): JSX.Element {
  // video
  const [playingVideo, setPlayingVideo] = useState<string>('');

  const onViewRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      if (viewableItems[0].item.mediaType === 'VIDEO') {
        // console.log('viewableItems', viewableItems[0].item?.id);
        setPlayingVideo(viewableItems[0].item?.id);
      }
      // TODO: FIXE temporary fix to avoid playing multiple videos at the same time
    }
  });

  // events & function to handle fetching more events when reaching the end
  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQueryGetLatestEvents();


  const handleInfiniteFetch = useCallback(() => {
    if (!isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [isFetching, hasNextPage, fetchNextPage]);


  // State variables to manage page and item heights
  const [layoutHeight, setLayoutHeight] = useState<DimensionValue>('100%');


  return (
    <SafeAreaView style={{ flex: 1 }}>

      <StatusBar style={'auto'} />

      <View style={styles.container}>
        {/* Latest events list */}
        <FlashList
          onLayout={(e) => setLayoutHeight(e.nativeEvent.layout.height)}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 30 }}
          keyExtractor={item => item.id.toString()}
          removeClippedSubviews={true}
          refreshing={isFetching}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={Dimensions.get('window').height - 54}
          pagingEnabled={true}
          data={data?.pages.flatMap(page => page.events)}
          onEndReached={handleInfiniteFetch}
          onEndReachedThreshold={1.5}
          renderItem={({ item }) => (
            <MemoizedEventItem
              key={item.id}
              item={item}
              playingVideo={playingVideo}
              layoutHeight={layoutHeight}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  img: {
    aspectRatio: 1,
    borderRadius: 50,
    height: 48,
    overflow: 'hidden',
    width: 48,
  },

  organizer: {
    fontSize: 18,
    fontWeight: '500'
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
    fontSize: 22,
    fontWeight: '600',
    paddingHorizontal: 20,
    position: 'absolute',
    textAlign: 'center',
    top: 40
  }
});


// Define the props for the memoized list item
interface ListItemProps {
  item: LikedEvent,
  playingVideo: string,
  layoutHeight: DimensionValue,
}

const EventItem: FC<ListItemProps> = ({ playingVideo, item, layoutHeight }) => {
  // video
  const videoRef = React.useRef<Video>(null);
  const videoShouldPlay: boolean = playingVideo === item.id.toString();

  // Get access to colors and store data
  const { red100, tabIconDefault } = useColors();

  // global state
  const { setToggleActionSheet, setLikedEvent } = useCometaStore(state => state);

  const showEventDetails = (item: LikedEvent): void => {
    setLikedEvent(item);
    setToggleActionSheet(true);
  };

  // perform mutations
  const likeOrDislikeMutation = useMutationLikeOrDislikeEvent();
  const handleLikeOrDislike = () => likeOrDislikeMutation.mutate(item.id);


  // can be lifted to the parent component like before
  const swipeLeft = Gesture.Fling();
  swipeLeft
    .direction(Directions.LEFT)
    .onStart(() => router.push('/bucketList'));


  const doubleTap = Gesture.Tap();
  doubleTap
    .numberOfTaps(2)
    .onEnd(() => likeOrDislikeMutation.mutate(item.id));


  // play video on appear and pause on disappear
  useEffect(() => {
    if (videoRef.current) {
      if (videoShouldPlay) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
      }
    }
  }, [videoShouldPlay]);


  return (
    <GestureDetector gesture={swipeLeft}>
      <View style={{
        alignItems: 'center',
        height: layoutHeight,
        justifyContent: 'center',
        width: '100%'
      }}>

        {/* Background image or video */}
        <GestureDetector gesture={doubleTap}>
          {item.mediaType === 'IMAGE' ? (
            <Image
              source={{ uri: item.mediaUrl }}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <Video
              ref={videoRef}
              useNativeControls
              resizeMode={ResizeMode.COVER}
              source={{ uri: item.mediaUrl }}
              style={{ width: '100%', height: '100%', overflow: 'hidden' }}
            // onPlaybackStatusUpdate={(status) => {
            //   if (!status.isLoaded) {
            //     // Error handling
            //   } else {
            //     if (status.isPlaying && !videoShouldPlay) {
            //       video.current?.pauseAsync();
            //     } else if (!status.isPlaying && videoShouldPlay) {
            //       video.current?.playAsync();
            //     }
            //   }
            // }}
            />
          )}
        </GestureDetector>
        {/* Background image or video */}

        {/* Event title */}
        <Text lightColor='#fff' darkColor='#eee' style={styles.title}>{item.name}</Text>

        {/* Positioned buttons */}
        <View lightColor='transparent' darkColor='transparent' style={styles.positionedButtons}>
          <Pressable onPress={handleLikeOrDislike}>
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
          <Pressable onPressOut={() => showEventDetails(item)}>
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
          {item?.organization?.mediaUrl ? (
            <Image style={styles.img} source={{ uri: item.organization?.mediaUrl }} />
          ) : (
            <Image style={styles.img} source={require('../../assets/images/icon.png')} />
          )}
          <Text
            lightColor='#fff'
            darkColor='#eee'
            style={styles.organizer}>
            {item.organization.name}
          </Text>
        </View>
        {/* Organizer icon */}
      </View>
    </GestureDetector>
  );
};

/**
 * 
 * @description This function is used to compare the props of the list item.
 * If false the list item will be re-rendered, otherwise it will not 
 * @returns boolean 
 */
function arePropsEqual(prevProps: ListItemProps, nextProps: ListItemProps): boolean {
  // Implement your custom comparison logic here
  // Return true if the props are equal, return false if they are not
  return (
    prevProps.playingVideo === nextProps.playingVideo &&
    prevProps.item.isLiked === nextProps.item.isLiked &&
    prevProps.layoutHeight === nextProps.layoutHeight
  );
}

const MemoizedEventItem = React.memo(EventItem, arePropsEqual);
