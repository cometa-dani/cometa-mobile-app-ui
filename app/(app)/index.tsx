import React, { FC, useCallback, useState } from 'react';
import { LikedEvent, } from '../../models/Event';
import { StyleSheet, DimensionValue, Pressable, SafeAreaView, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Text, View, useColors } from '../../components/Themed';
import { GestureDetector, Gesture, ScrollView } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { useInfiniteQueryGetLatestEvents, useMutationLikeOrDislikeEvent } from '../../queries/eventHooks';
// import { useCometaStore } from '../../store/cometaStore';
import { Image } from 'expo-image'; // use with thumbhash
import { LinearGradient } from 'expo-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { gray_200, white_50 } from '../../constants/colors';
import { AppTransparentModal } from '../../components/modal/transparentModal';
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
    overflow: 'hidden',
  },
});


// Define the props for the memoized list item
interface ListItemProps {
  item: LikedEvent,
  layoutHeight: DimensionValue,
}

const EventItem: FC<ListItemProps> = ({ item, layoutHeight }) => {
  // Get access to colors and store data
  const { red100, white50 } = useColors();

  // carousel slider pagination
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [toggleMoreInfo, setToggleMoreInfo] = useState<boolean>(false);

  // global state
  // const { setToggleActionSheet, setLikedEvent } = useCometaStore(state => state);

  // const showEventDetails = useCallback((item: LikedEvent): void => {
  //   setLikedEvent(item);
  //   setToggleActionSheet(true);
  // }, [item]);

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
    }}>
      {/* carousel */}
      <View style={{ flex: 1, position: 'relative' }}>
        <GestureDetector gesture={doubleTap}>
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
              <MemoizedCarouselItem key={item.id} item={item} />
            )}
          />
        </GestureDetector>

        <Pagination
          dotsLength={3}
          activeDotIndex={activeSlide}
          containerStyle={stylesEventItem.paginationContainer}
          dotStyle={stylesEventItem.paginationDots}
          inactiveDotOpacity={0.5}
          inactiveDotScale={0.8}
        />

        {/* Positioned buttons */}
        <View lightColor='transparent' darkColor='transparent' style={stylesEventItem.positionedButtons}>
          <Pressable onPress={handleLikeOrDislike}>
            {({ hovered, pressed }) => (
              (item.isLiked) ? (
                <FontAwesome name='heart' size={34} style={{ color: (hovered && pressed) ? white50 : red100 }} />
              ) : (
                <FontAwesome name='heart-o' size={34} style={{ color: (hovered && pressed) ? red100 : white50 }} />
              )
            )}
          </Pressable>
          <Pressable>
            {() => (
              <Image style={{ objectFit: 'contain', width: 42, height: 34 }} source={require('../../assets/icons/Share.png')} />
            )}
          </Pressable>
          <Pressable
          // onPressOut={() => showEventDetails(item)}
          >
            {() => (
              <Image style={{ objectFit: 'contain', width: 34, height: 34 }} source={require('../../assets/icons/info.png')} />
            )}
          </Pressable>
        </View>
        {/* Positioned buttons /*}

        {/* modal */}
        <AppTransparentModal>
          {(setIsOpen) => (
            <ScrollView>
              <View lightColor='transparent' darkColor='transparent' style={stylesEventItem.eventInfoContainer}>
                <Text
                  lightColor='#fff'
                  darkColor='#eee'
                  numberOfLines={2}
                  ellipsizeMode='tail'
                  style={stylesEventItem.eventTitle}
                >
                  {item.name}
                </Text>

                <View style={stylesEventItem.tagContainer}>
                  <Text style={stylesEventItem.tagText}>{item.category}</Text>
                </View>

                <Text
                  lightColor='#fff'
                  darkColor='#eee'
                  numberOfLines={2}
                  ellipsizeMode='tail'
                  onPress={() => setIsOpen(true)}
                >
                  {item.description}
                </Text>
                {/* collapsed */}
              </View>
            </ScrollView>
          )}
        </AppTransparentModal>
        {/* modal */}
      </View>
      {/* carousel */}

      {/* likes */}
      <View style={stylesEventItem.likesContainer}>
        <Text style={{ fontWeight: '900', fontSize: 16 }}>
          {item._count.likes} Likes
        </Text>
      </View>
      {/* likes */}
    </View>
  );
};


const CarouselItem: FC<{ item: LikedEvent }> = ({ item }) => {
  return (
    <View>
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        start={[0.2, 1]}
        end={[0, 0.6]}
        style={stylesEventItem.backdrop}
      />
      <Image
        source={item.mediaUrl}
        style={stylesEventItem.imgBackground}
        placeholder={'L39HdjPsUhyE05m0ucW,00lTm]R5'}
        transition={200}
      />
    </View>
  );
};

const MemoizedCarouselItem = React.memo(CarouselItem, () => true);


const stylesEventItem = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },

  eventInfoContainer: {
    bottom: 60,
    gap: 12,
    height: 300,
    left: 20,
    position: 'absolute',
    width: '72%',
  },

  eventTitle: {
    fontSize: 20,
    fontWeight: '500',
  },

  imgBackground: { height: '100%', width: '100%' },

  likesContainer: {
    backgroundColor: '#83C9DD',
    paddingHorizontal: 24,
    paddingVertical: 10
  },

  paginationContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    bottom: 0,
    position: 'absolute',
    width: '100%'
  },

  paginationDots: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 10,
    height: 10,
    marginHorizontal: -2,
    width: 10
  },

  positionedButtons: {
    alignItems: 'center',
    bottom: 34,
    gap: 24,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
  },

  tagContainer: {
    alignSelf: 'flex-start',
    backgroundColor: gray_200,
    borderRadius: 10,
    elevation: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  tagText: {
    color: white_50,
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'uppercase'
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
