import React, { FC, useEffect, useRef, useState } from 'react';
import { LikeableEvent, } from '../../models/Event';
import { StyleSheet, DimensionValue, Pressable, Dimensions, View as TransParentView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Text, View, useColors } from '../Themed';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useMutationLikeOrDislikeEvent } from '../../queries/loggedInUser/likeEventHooks';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { gray_200, white_50 } from '../../constants/colors';
import { If } from '../utils/ifElse';
import { Photo } from '../../models/Photo';
import { ForEach } from '../utils/ForEach';

//icons
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const eventItemEstimatedHeight = Dimensions.get('window').height - 128;
const carouselEstimatedWidth = Dimensions.get('window').width - 20;


interface EventsListProps {
  items: LikeableEvent[],
  onInfiniteScroll: () => void,
  isLoading: boolean,
  hideLikeAndShareButtons?: boolean,
  targetUserId?: number,
  initialScrollIndex?: number,
}

export const EventsFlashList: FC<EventsListProps> = ({ onInfiniteScroll, isLoading, items, hideLikeAndShareButtons, targetUserId, initialScrollIndex = 0 }) => {
  const [layoutHeight, setLayoutHeight] = useState<DimensionValue>('100%');
  // perform mutations
  const mutateEventLike = useMutationLikeOrDislikeEvent();
  const onHandleLikeButtonPress = (eventID: number) => {
    mutateEventLike.mutate({ eventID, targetUserId });
  };
  const listRef = useRef<FlashList<LikeableEvent>>(null);


  useEffect(() => {
    if (!isLoading) {
      listRef.current?.scrollToIndex({
        index: initialScrollIndex,
        animated: false
      });
    }
  }, [initialScrollIndex, isLoading]);


  return (
    <If
      condition={isLoading}
      render={<SkeletonLoader />}
      elseRender={(
        <FlashList
          onLayout={(e) => setLayoutHeight(e.nativeEvent.layout.height)}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={eventItemEstimatedHeight}
          initialScrollIndex={initialScrollIndex}
          // scrollToOverflowEnabled={true}
          // scrollEnabled={true}
          // refreshing
          // refreshControl={}  // pull to refresh feaature
          ref={listRef}
          pagingEnabled={true}
          data={items}
          onEndReached={onInfiniteScroll}
          onEndReachedThreshold={0.4}
          decelerationRate={'normal'}
          renderItem={({ item }) => (
            <EventItem
              hideLikeAndShareButtons={hideLikeAndShareButtons}
              key={item.id}
              item={item}
              layoutHeight={layoutHeight}
              onHandleLikeButtonPress={onHandleLikeButtonPress}
            />
          )}
        />
      )}
    />
  );
};


const SkeletonLoader: FC = () => {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  return (
    <>
      <ContentLoader
        speed={1}
        width={width - 20}
        height={height - 120}
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


// Define the props for the memoized list item
interface ListItemProps {
  item: LikeableEvent,
  layoutHeight: DimensionValue,
  hideLikeAndShareButtons?: boolean,
  onHandleLikeButtonPress: (id: number) => void,
}

const EventItem: FC<ListItemProps> = ({ item, layoutHeight, hideLikeAndShareButtons = false, onHandleLikeButtonPress }) => {
  // Get access to colors and store data
  const { red100, white50 } = useColors();

  // carousel slider pagination
  const [activeSlide, setActiveSlide] = useState<number>(0);

  // expand description
  const [isExpanded, setIsExpanded] = useState(false);

  // double tap gesture
  const doubleTap = Gesture.Tap();
  doubleTap
    .numberOfTaps(2)
    .onEnd(() => onHandleLikeButtonPress(item.id));

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
            inactiveSlideScale={0.84}
            sliderWidth={carouselEstimatedWidth}
            itemWidth={carouselEstimatedWidth}
            data={item?.photos ?? []}
            onSnapToItem={(index) => setActiveSlide(index)}
            shouldOptimizeUpdates={true}
            renderItem={renderCarouselItem}
          />
        </GestureDetector>

        <Pagination
          dotsLength={item?.photos?.length ?? 1}
          activeDotIndex={activeSlide}
          containerStyle={stylesEventItem.paginationContainer}
          dotStyle={{ ...stylesEventItem.paginationDots }}
          inactiveDotOpacity={0.5}
          inactiveDotScale={0.8}
        />

        {/* positioned buttons */}
        <TransParentView style={stylesEventItem.positionedButtons}>
          <If
            condition={!hideLikeAndShareButtons}
            render={(
              <>
                <TransParentView style={{ alignItems: 'center', gap: 2 }}>
                  <Pressable onPress={() => onHandleLikeButtonPress(item.id)}>
                    {({ pressed }) => (
                      (item.isLiked) ? (
                        <FontAwesome name='heart' size={28} style={{ color: red100 }} />
                      ) : (
                        <FontAwesome name='heart-o' size={28} style={{ color: (pressed) ? red100 : white50 }} />
                      )
                    )}
                  </Pressable>
                  <Text lightColor='#fff'>{item._count.likes || 0}</Text>
                </TransParentView>

                <TransParentView style={{ alignItems: 'center', gap: 2 }}>
                  <Pressable>
                    {() => (
                      <FontAwesome name="share" size={28} color="white" />        // <Image style={{ width: 28, height: 28 }} source={icons.share} />
                    )}
                  </Pressable>
                  <Text lightColor='#fff'>{3612}</Text>
                </TransParentView>
              </>
            )}
          />

          <Pressable>
            {() => (
              <FontAwesome6 name="location-dot" size={28} color="white" />
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
            size='xl'
            style={stylesEventItem.textShadow}
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
                    fontSize: 14,
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


const renderCarouselItem = ({ item }: { item: Photo }) => (
  <CarouselItem key={item.id} item={item} />
);


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
    bottom: 34,
    gap: 12,
    left: 14,
    position: 'absolute',
    width: '70%',
  },

  imgBackground: { height: '100%', width: '100%' },

  paginationContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    position: 'absolute',
    padding: 0,
    margin: 0,
    width: '100%',
    bottom: -14,
  },

  paginationDots: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 10,
    height: 8,
    marginHorizontal: -2,
    width: 8,
    position: 'relative',
  },

  positionedButtons: {
    alignItems: 'center',
    bottom: 34,
    gap: 24,
    justifyContent: 'center',
    position: 'absolute',
    right: 14,
  },

  tagContainer: {
    alignSelf: 'flex-start',
    backgroundColor: gray_200,
    borderRadius: 10,
    elevation: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  tagText: {
    color: white_50,
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
