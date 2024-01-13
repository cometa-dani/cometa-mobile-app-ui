import React, { FC, useCallback, useState } from 'react';
import { LikedEvent, } from '../../models/Event';
import { StyleSheet, DimensionValue, Pressable, SafeAreaView, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Text, View, useColors } from '../../components/Themed';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { useInfiniteQueryGetLatestEvents, useMutationLikeOrDislikeEvent } from '../../queries/eventHooks';
import { useCometaStore } from '../../store/cometaStore';
import { Image } from 'expo-image'; // use with thumbhash
import { LinearGradient } from 'expo-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
// import Carousel from 'react-native-reanimated-carousel';


export default function HomeScreen(): JSX.Element {
  // colors
  const { background } = useColors();

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
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <View style={styles.container}>
        <FlashList
          onLayout={(e) => setLayoutHeight(e.nativeEvent.layout.height)}
          refreshing={isFetching}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={Dimensions.get('window').height - 100}
          pagingEnabled={true}
          data={data?.pages.flatMap(page => page.events)}
          onEndReached={handleInfiniteFetch}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => (
            <MemoizedEventItem
              key={item.id}
              item={item}
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
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 10,
    overflow: 'hidden'
  },
});


// Define the props for the memoized list item
interface ListItemProps {
  item: LikedEvent,
  layoutHeight: DimensionValue,
}

const EventItem: FC<ListItemProps> = ({ item, layoutHeight }) => {
  // Get access to colors and store data
  const { red100, tabIconDefault } = useColors();

  // carousel slider pagination
  const [activeSlide, setActiveSlide] = useState<number>(0);

  // global state
  const { setToggleActionSheet, setLikedEvent } = useCometaStore(state => state);

  const showEventDetails = useCallback((item: LikedEvent): void => {
    setLikedEvent(item);
    setToggleActionSheet(true);
  }, [item]);

  // perform mutations
  const likeOrDislikeMutation = useMutationLikeOrDislikeEvent();
  const handleLikeOrDislike = () => likeOrDislikeMutation.mutate(item.id);

  // double tap gesture
  const doubleTap = Gesture.Tap();
  doubleTap
    .numberOfTaps(2)
    .onEnd(() => likeOrDislikeMutation.mutate(item.id));


  return (
    <View style={{
      height: layoutHeight,
      flex: 1,
      position: 'relative'
    }}>
      {/* Background image or video */}
      <GestureDetector gesture={doubleTap}>
        <View style={{ flex: 1 }}>
          <Carousel
            layout='default'
            vertical={false}
            activeSlideOffset={0}
            inactiveSlideOpacity={0.6}
            inactiveSlideScale={0.78}
            sliderWidth={Dimensions.get('window').width - 20}
            itemWidth={Dimensions.get('window').width - 20}
            data={[{ ...item, id: 100 }, { ...item, id: 110 }, { ...item, id: 210 }]}
            onSnapToItem={(index) => setActiveSlide(index)}
            renderItem={({ item }) => (
              <View key={item.id}>
                <LinearGradient
                  colors={['rgba(0,0,0,0.8)', 'transparent']}
                  start={[0.16, 1]}
                  end={[0, 0.7]}
                  style={stylesEventItem.backdrop}
                />
                <Image
                  source={item.mediaUrl}
                  style={stylesEventItem.imgBackground}
                  placeholder={'L39HdjPsUhyE05m0ucW,00lTm]R5'}
                  transition={200}
                />
              </View>
            )}
          />
        </View>
      </GestureDetector>

      <View style={{ backgroundColor: '#83C9DD', paddingVertical: 10, paddingHorizontal: 24 }}>
        <Text style={{ fontWeight: '900', fontSize: 16 }}>{item._count.likes} Likes</Text>
      </View>
      {/* Background image or video */}

      <Pagination
        dotsLength={3}
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', position: 'absolute', bottom: 40, width: '100%' }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 7,
          backgroundColor: 'rgba(255, 255, 255, 0.92)'
        }}
        inactiveDotStyle={{
          // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.5}
        inactiveDotScale={0.8}
      />

      {/* Event title */}
      <Text lightColor='#fff' darkColor='#eee' style={stylesEventItem.title}>{item.name}</Text>

      {/* Positioned buttons */}
      <View lightColor='transparent' darkColor='transparent' style={stylesEventItem.positionedButtons}>
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
            <Image style={{ objectFit: 'contain', width: 42, height: 34 }} source={require('../../assets/icons/share.jpeg')} />
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
              <FontAwesome name='info' size={20} style={{ color: tabIconDefault }} />
            </View>
          )}
        </Pressable>
      </View>
      {/* Positioned buttons /*}

      {/* Organizer icon */}
      <View lightColor='transparent' darkColor='transparent' style={stylesEventItem.organizerContainer}>
        {item?.organization?.mediaUrl ? (
          <Image style={stylesEventItem.logo} source={{ uri: item.organization?.mediaUrl }} />
        ) : (
          <Image style={stylesEventItem.logo} source={require('../../assets/images/icon.png')} />
        )}
        <Text
          lightColor='#fff'
          darkColor='#eee'
          style={stylesEventItem.organizer}>
          {item.organization.name}
        </Text>
      </View>
      {/* Organizer icon */}
    </View>
  );
};


const stylesEventItem = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },

  imgBackground: { height: '100%', width: '100%' },

  logo: {
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
    bottom: 64,
    flexDirection: 'row',
    gap: 12,
    left: 20,
    position: 'absolute'
  },

  positionedButtons: {
    alignItems: 'center',
    bottom: 64,
    gap: 24,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
  },

  title: {
    alignSelf: 'center',
    fontSize: 22,
    fontWeight: '600',
    paddingHorizontal: 20,
    position: 'absolute',
    textAlign: 'center',
    top: 40
  }
});

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
    // prevProps.playingVideo === nextProps.playingVideo &&
    prevProps.item.isLiked === nextProps.item.isLiked &&
    prevProps.layoutHeight === nextProps.layoutHeight
  );
}

const MemoizedEventItem = React.memo(EventItem, arePropsEqual);
