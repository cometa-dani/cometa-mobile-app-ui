import { FC, useRef, useState } from 'react';
import { ILikeableEvent, } from '../../models/Event';
import { Pressable, View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { ImageBackground } from 'expo-image';
import { ForEach } from '../utils/ForEach';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Condition } from '../utils/ifElse';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { Center, VStack } from '../utils/stacks';
import { LinearGradient } from 'expo-linear-gradient';
import { CircleButton } from '../button/circleButton';
import { tabBarHeight } from '../tabBar/tabBar';
import * as WebBrowser from 'expo-web-browser';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';


interface EventsListProps {
  items: ILikeableEvent[],
  onInfiniteScroll: () => void,
  isFetched: boolean,
  hideLikeAndShareButtons?: boolean,
  targetUserId?: number,
  initialScrollIndex?: number,
  onPressLikeButton: (event: ILikeableEvent) => void
}
export const EventsList: FC<EventsListProps> = ({
  onInfiniteScroll,
  isFetched,
  items,
  hideLikeAndShareButtons,
  onPressLikeButton,
  targetUserId,
  initialScrollIndex = 0
}) => {
  const { theme } = useStyles();
  const listRef = useRef<FlashList<ILikeableEvent>>(null);
  // useEffect(() => {
  //   if (!isLoading) {
  //     listRef.current?.scrollToIndex({
  //       index: initialScrollIndex,
  //       animated: false
  //     });
  //   }
  // }, [initialScrollIndex, isLoading]);
  return (
    <Condition
      if={isFetched}
      then={(
        <FlashList
          ref={listRef}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={UnistylesRuntime.screen.height}
          // refreshControl={}  // pull to refresh feaature
          pagingEnabled={true}
          data={items}
          onEndReached={onInfiniteScroll}
          onEndReachedThreshold={1}
          renderItem={renderItem({ hideLikeAndShareButtons, onPressLikeButton })}
        />
      )}
      else={(
        <Center styles={{ flex: 1 }}>
          <ActivityIndicator
            size="large"
            style={{ marginTop: -theme.spacing.sp8 }}
            color={theme.colors.red100}
          />
        </Center>
      )}
    />
  );
};


interface IRenderItem extends Pick<EventsListProps, (
  'hideLikeAndShareButtons' |
  'onPressLikeButton'
)> { }
const renderItem = ({ hideLikeAndShareButtons, onPressLikeButton }: IRenderItem) => {
  const item = ({ item }: { item: ILikeableEvent }) => (
    <EventItem
      hideLikeAndShareButtons={hideLikeAndShareButtons}
      item={item}
      onPressLikeButton={onPressLikeButton}
    />
  );
  return item;
};


interface ListItemProps {
  item: ILikeableEvent,
  hideLikeAndShareButtons?: boolean,
  onPressLikeButton: (event: ILikeableEvent) => void,
}
const EventItem: FC<ListItemProps> = ({ item, hideLikeAndShareButtons = false, onPressLikeButton }) => {
  const { styles, theme } = useStyles(styleSheet);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const doubleTapOnLikeButton = Gesture.Tap();
  doubleTapOnLikeButton
    .runOnJS(true)
    .numberOfTaps(2)
    .onEnd(() => onPressLikeButton(item));

  const openBrowser = async () => {
    await WebBrowser.openBrowserAsync(item.location?.mapUrl ?? '');
  };

  return (
    <View style={{ position: 'relative' }}>
      <GestureDetector gesture={doubleTapOnLikeButton}>
        <View collapsable={false}>
          <ImageBackground
            source={item.photos.at(0)?.url}
            style={styles.imgBackground}
            placeholder={{ thumbhash: item.photos.at(0)?.placeholder }}
            contentFit='cover'
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.74)', 'transparent']}
              style={{
                position: 'absolute',
                top: 0,
                zIndex: 1,
                height: 290,
                width: '100%'
              }}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.8)']}
              style={{
                position: 'absolute',
                bottom: 0,
                zIndex: 1,
                height: 280,
                width: '100%'
              }}
            />
            <Condition
              if={isTextExpanded}
              then={
                <LinearGradient
                  colors={['rgba(0,0,0,0.64)', 'rgba(0,0,0,0.64)']}
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    zIndex: 100_000,
                    height: UnistylesRuntime.screen.height,
                    width: '100%'
                  }}
                />
              }
            />
          </ImageBackground>
        </View>
      </GestureDetector>

      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={styles.eventInfoContainer}
        contentContainerStyle={{ gap: theme.spacing.sp4 }}
      >
        <Pressable onPress={() => setIsTextExpanded(prev => !prev)}>
          <Text
            numberOfLines={isTextExpanded ? undefined : 2}
            ellipsizeMode='tail'
            style={{
              ...styles.textShadow,
              fontSize: theme.text.size.s8,
              fontFamily: theme.text.fontBold
            }}
          >
            {item.name}
          </Text>
        </Pressable>

        <View style={{ flexDirection: 'row', gap: theme.spacing.sp4 }}>
          <ForEach items={item.categories}>
            {(category, index) => (
              <View key={index} style={styles.tagContainer}>
                <Text style={styles.tagText}>{category}</Text>
              </View>
            )}
          </ForEach>
        </View>

        <Pressable
          style={{ width: '100%' }}
          onPress={() => setIsTextExpanded(prev => !prev)}
        >
          {({ pressed }) => (
            <>
              <Text
                numberOfLines={isTextExpanded ? undefined : 2}
                ellipsizeMode='tail'
                style={[
                  styles.textShadow,
                  {
                    fontSize: 14,
                    opacity: pressed ? 0.84 : 1
                  }
                ]}
              >
                {item.description}
              </Text>
              <Text
                style={[
                  styles.textShadow,
                  {
                    fontFamily: theme.text.fontBold,
                    fontSize: 14,
                    opacity: pressed ? 0.84 : 1
                  }
                ]}>
                {!isTextExpanded ? 'show more' : 'show less'}
              </Text>
            </>
          )}
        </Pressable>
      </ScrollView>

      <VStack
        gap={theme.spacing.sp6}
        styles={styles.positionedButtons}
      >
        <CircleButton
          opacity={0.26}
          size={theme.spacing.sp14}
          light={false}
          onPress={() => onPressLikeButton(item)}
        >
          <FontAwesome
            name='heart'
            size={theme.spacing.sp10}
            style={{
              color: item.isLiked ? theme.colors.red90 : theme.colors.white90
            }}
          />
        </CircleButton>
        <CircleButton
          opacity={0.26}
          size={theme.spacing.sp14}
          light={false}
        >
          <Feather
            name="share-2"
            size={theme.spacing.sp10}
            style={{ color: theme.colors.white90 }}
          />
        </CircleButton>
        <CircleButton
          opacity={0.26}
          size={theme.spacing.sp14}
          light={false}
          onPress={() => openBrowser()}
        >
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={theme.spacing.sp11}
            style={{ color: theme.colors.white90 }}
          />
        </CircleButton>
        <CircleButton
          opacity={0.26}
          size={theme.spacing.sp14}
          light={false}
        >
          <MaterialCommunityIcons
            name="qrcode"
            size={theme.spacing.sp11}
            style={{ color: theme.colors.white90 }}
          />
        </CircleButton>
      </VStack>
    </View>
  );
};


const styleSheet = createStyleSheet((theme, runtime) => ({
  eventInfoContainer: {
    bottom: tabBarHeight + runtime.insets.bottom + 16,
    gap: theme.spacing.sp4,
    left: theme.spacing.sp6,
    position: 'absolute',
    width: '72%',
    maxHeight: runtime.screen.height - (2.1 * (tabBarHeight + runtime.insets.bottom + 24)),
    zIndex: 100_000_000
  },
  imgBackground: {
    height: runtime.screen.height,
    flex: 1,
    width: '100%'
  },
  positionedButtons: {
    position: 'absolute',
    bottom: tabBarHeight + runtime.insets.bottom + 50,
    zIndex: 100,
    right: theme.spacing.sp6
  },
  tagContainer: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.red50,
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
    color: theme.colors.red100,
    fontWeight: '500',
    textTransform: 'uppercase',
    fontFamily: theme.text.fontMedium,
  },
  textShadow: {
    color: theme.colors.white90,
    fontFamily: theme.text.fontRegular,
    borderRadius: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: -1, height: 2 },
    textShadowRadius: 10
  },
  wrapper: { flex: 1, position: 'relative' }
}));
