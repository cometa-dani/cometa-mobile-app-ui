import React, { FC, useMemo, useState } from 'react';
import { LikedEvent, } from '../../models/Event';
import { StyleSheet, DimensionValue, Pressable, SafeAreaView, Dimensions, View as TransParentView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Text, View, useColors } from '../../components/Themed';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { useInfiniteQueryGetLatestEvents, useMutationLikeOrDislikeEvent } from '../../queries/eventHooks';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { gray_200, white_50 } from '../../constants/colors';
import { icons } from '../../constants/assets';
import { If } from '../../components/utils/ifElse';
import { Photo } from '../../models/Photo';
import { ForEach } from '../../components/utils/ForEach';


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
        height={height - 140}
        viewBox={`0 0 ${width - 20} ${height - 140}`}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <Rect x="0" y="0" rx="16" ry="16" width="100%" height="100%" />
      </ContentLoader>

      <ContentLoader
        speed={1}
        style={{ position: 'absolute', top: 0, left: 0 }}
        width={width - 20}
        height={height - 140}
        viewBox={`0 0 ${width - 20} ${height - 140}`}
        backgroundColor="#e3e3e3"
        foregroundColor="#ddd"
      >
        <Circle cx={width - 74} cy="84%" r="28" />
        <Circle cx={width - 74} cy="74%" r="28" />
        <Circle cx={width - 74} cy="64%" r="28" />
      </ContentLoader>

      <ContentLoader
        speed={1}
        style={{ position: 'absolute', top: 0, left: 0 }}
        width={width - 20}
        height={height - 140}
        viewBox={`0 0 ${width - 20} ${height - 140}`}
        backgroundColor="#e3e3e3"
        foregroundColor="#ddd"
      >
        <Circle x="20" cx="20" cy="68%" r="24" />
        <Rect x="20" y="74%" width="120" height="16" rx="6" ry="6" />
        <Rect x="20" y="78%" width="140" height="16" rx="6" ry="6" />
        <Rect x="20" y="82%" width="160" height="16" rx="6" ry="6" />
        <Rect x="20" y="86%" width="180" height="16" rx="6" ry="6" />
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
        <If
          condition={isLoading}
          render={<SkeletonLoader />}
          elseRender={(
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


const renderCarouselItem = ({ item }: { item: Photo }) => (
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

  return (
    <View style={{
      height: layoutHeight,
    }}>
      {/* carousel */}
      <View style={stylesEventItem.wrapper}>
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'transparent']}
          start={[0, 1]}
          end={[0, 0.7]}
          style={stylesEventItem.backdrop}
        />
        <GestureDetector gesture={doubleTap}>
          <Carousel
            layout='default'
            vertical={false}
            activeSlideOffset={0}
            inactiveSlideScale={0.78}
            sliderWidth={carouselEstimatedWidth}
            itemWidth={carouselEstimatedWidth}
            data={item?.photos ?? []}
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


        {/* positioned buttons */}
        <TransParentView style={stylesEventItem.positionedButtons}>
          <TransParentView style={{ alignItems: 'center', gap: 2 }}>
            <Pressable onPress={handleLikeOrDislike}>
              {({ hovered, pressed }) => (
                (item.isLiked) ? (
                  <FontAwesome name='heart' size={34} style={{ color: (hovered && pressed) ? white50 : red100 }} />
                ) : (
                  <FontAwesome name='heart-o' size={34} style={{ color: (hovered && pressed) ? red100 : white50 }} />
                )
              )}
            </Pressable>
            <Text lightColor='#fff' style={{ fontWeight: '700', fontSize: 16 }}>{item._count.likes || 0}</Text>
          </TransParentView>

          <TransParentView style={{ alignItems: 'center', gap: 2 }}>
            <Pressable>
              {() => (
                <Image style={{ width: 42, height: 34 }} source={icons.share} />
              )}
            </Pressable>
            <Text lightColor='#fff' style={{ fontWeight: '700', fontSize: 16 }}>{3612}</Text>
          </TransParentView>

          <Pressable>
            {() => (
              <Image style={{ width: 36, height: 36 }} source={icons.locationMarker} />
            )}
          </Pressable>
        </TransParentView>
        {/* positioned buttons */}


        {/* event info */}
        <TransParentView style={stylesEventItem.eventInfoContainer}>
          <Text
            lightColor='#fff'
            darkColor='#eee'
            numberOfLines={2}
            ellipsizeMode='tail'
            style={[stylesEventItem.eventTitle, stylesEventItem.textShadow]}
          >
            {item.name}
          </Text>

          <TransParentView style={{ flexDirection: 'row', gap: 10 }}>
            <ForEach items={item.categories}>
              {(cat, index) => (
                <View key={index} style={stylesEventItem.tagContainer}>
                  <Text style={stylesEventItem.tagText}>{cat}</Text>
                </View>
              )}
            </ForEach>
          </TransParentView>

          <Pressable onPress={() => setIsExpanded(prev => !prev)}>
            {({ pressed }) => (
              <Text
                lightColor='#fff'
                darkColor='#eee'
                numberOfLines={isExpanded ? 24 : 2}
                ellipsizeMode='tail'
                style={[
                  stylesEventItem.textShadow,
                  {
                    opacity: pressed ? 0.84 : 1,
                    backgroundColor: pressed ? 'rgba(255,255,255,0.05)' : 'transparent',
                  }
                ]}
              >
                {item.description}
              </Text>
            )}
          </Pressable>
        </TransParentView>
        {/* event info */}
      </View>
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


const CarouselItem: FC<{ item: Photo }> = ({ item }) => {
  return (
    <Image
      source={item.url}
      style={stylesEventItem.imgBackground}
      placeholder={{ thumbhash: item.placeholder }}
    />
  );
};


const stylesEventItem = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  eventInfoContainer: {
    bottom: 70,
    gap: 12,
    left: 20,
    position: 'absolute',
    width: '70%',
  },

  eventTitle: {
    fontSize: 20,
    fontWeight: '500',
  },

  imgBackground: { height: '100%', width: '100%' },

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
    bottom: 70,
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

  textShadow: {
    borderRadius: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },

  wrapper: { flex: 1, position: 'relative' }
});
