import React, { FC, useMemo, useState } from 'react';
import { LikedEvent, } from '../../models/Event';
import { StyleSheet, DimensionValue, Pressable, SafeAreaView, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Text, View, useColors } from '../../components/Themed';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { useInfiniteQueryGetLatestEvents, useMutationLikeOrDislikeEvent } from '../../queries/eventHooks';
import { Image } from 'expo-image'; // use with thumbhash
import { LinearGradient } from 'expo-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { gray_200, white_50 } from '../../constants/colors';
import { icons } from '../../constants/assets';


const eventItemEstimatedHeight = Dimensions.get('window').height - 160;
const carouselEstimatedWidth = Dimensions.get('window').width - 20;


const SkeletonLoader: FC = () => {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  return (
    <>
      <ContentLoader
        speed={1}
        width={width - 20}
        height={height - 160}
        viewBox={`0 0 ${width - 20} ${height - 160}`}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <Rect x="0" y="0" rx="16" ry="16" width="100%" height="100%" />
      </ContentLoader>

      <ContentLoader
        speed={1}
        style={{ position: 'absolute', top: 0, left: 0 }}
        width={width - 20}
        height={height - 160}
        viewBox={`0 0 ${width - 20} ${height - 160}`}
        backgroundColor="#e3e3e3"
        foregroundColor="#ddd"
      >
        <Circle cx={width - 74} cy="92%" r="28" />
        <Circle cx={width - 74} cy="82%" r="28" />
        <Circle cx={width - 74} cy="72%" r="28" />
      </ContentLoader>

      <ContentLoader
        speed={1}
        style={{ position: 'absolute', top: 0, left: 0 }}
        width={width - 20}
        height={height - 160}
        viewBox={`0 0 ${width - 20} ${height - 160}`}
        backgroundColor="#e3e3e3"
        foregroundColor="#ddd"
      >
        <Circle x="20" cx="20" cy="72%" r="24" />
        <Rect x="20" y="78%" width="120" height="16" rx="6" ry="6" />
        <Rect x="20" y="82%" width="140" height="16" rx="6" ry="6" />
        <Rect x="20" y="86%" width="160" height="16" rx="6" ry="6" />
        <Rect x="20" y="90%" width="180" height="16" rx="6" ry="6" />
      </ContentLoader>
    </>
  );
};


export default function HomeScreen(): JSX.Element {
  // colors
  const { background } = useColors();

  // State variables to manage page and item heights
  const [layoutHeight, setLayoutHeight] = useState<DimensionValue>('100%');

  // events & function to handle fetching more events when reaching the end
  const { data, isFetching, fetchNextPage, hasNextPage, isLoading } = useInfiniteQueryGetLatestEvents();
  const eventsData = useMemo(() => data?.pages.flatMap(page => page.events) || [], [data?.pages]);

  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <View style={styles.container}>
        {isLoading ?
          <SkeletonLoader />
          :
          <FlashList
            onLayout={(e) => setLayoutHeight(e.nativeEvent.layout.height)}
            refreshing={isFetching}
            showsVerticalScrollIndicator={false}
            estimatedItemSize={eventItemEstimatedHeight}
            pagingEnabled={true}
            data={eventsData}
            onEndReached={handleInfiniteFetch}
            onEndReachedThreshold={0.4}
            renderItem={({ item }) => (
              <MemoizedEventItem
                key={item.id}
                item={item}
                layoutHeight={layoutHeight}
              />
            )}
          />
        }
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


const renderCarouselItem = ({ item }: { item: LikedEvent }) => (
  <CarouselItem key={item.id} item={item} />
);


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

  // perform mutations
  const likeOrDislikeMutation = useMutationLikeOrDislikeEvent();
  const handleLikeOrDislike = () => likeOrDislikeMutation.mutate(item.id);

  // expand description
  const [isExpanded, setIsExpanded] = useState(false);

  // double tap gesture
  const doubleTap = Gesture.Tap();
  doubleTap
    .numberOfTaps(2)
    .onEnd(() => likeOrDislikeMutation.mutate(item.id));

  const carouselData = [
    { ...item, id: 100 },
    { ...item, id: 110 },
    { ...item, id: 210 }
  ];

  return (
    <View style={{
      height: layoutHeight,
    }}>
      {/* carousel */}
      <View style={stylesEventItem.wrapper}>
        <GestureDetector gesture={doubleTap}>
          <Carousel
            layout='default'
            vertical={false}
            activeSlideOffset={0}
            inactiveSlideScale={0.78}
            sliderWidth={carouselEstimatedWidth}
            itemWidth={carouselEstimatedWidth}
            data={carouselData}
            onSnapToItem={(index) => setActiveSlide(index)}
            renderItem={renderCarouselItem}
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
              <Image style={{ width: 42, height: 34 }} source={icons.share} />
            )}
          </Pressable>
          <Pressable>
            {() => (
              <Image style={{ width: 34, height: 34 }} source={icons.info} />
            )}
          </Pressable>
        </View>
        {/* Positioned buttons /*}

        {/* collapsed */}
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
            numberOfLines={isExpanded ? 14 : 2}
            ellipsizeMode='tail'
            onPress={() => setIsExpanded(prev => !prev)}
          >
            {item.description}
          </Text>
        </View>
        {/* collapsed */}
      </View>
      {/* carousel */}

      {/* likes */}
      {/* <View style={stylesEventItem.likesContainer}>
        <Text style={{ fontWeight: '900', fontSize: 16 }}>
          {item._count.likes} Likes
        </Text>
      </View> */}
      {/* likes */}
    </View>
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
    // prevProps.playingVideo === nextProps.playingVideo &&
    prevProps.item.isLiked === nextProps.item.isLiked &&
    prevProps.layoutHeight === nextProps.layoutHeight
  );
}

const MemoizedEventItem = React.memo(EventItem, arePropsEqual);


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


const stylesEventItem = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },

  eventInfoContainer: {
    bottom: 60,
    gap: 12,
    // height: 300,
    left: 20,
    position: 'absolute',
    width: '72%',
  },

  eventTitle: {
    fontSize: 20,
    fontWeight: '500',
  },

  imgBackground: { height: '100%', width: '100%' },

  // likesContainer: {
  //   backgroundColor: '#83C9DD',
  //   paddingHorizontal: 24,
  //   paddingVertical: 10
  // },

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
  },

  wrapper: { flex: 1, position: 'relative' }
});
