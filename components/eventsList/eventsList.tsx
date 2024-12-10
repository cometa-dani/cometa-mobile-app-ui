import React, { FC, useEffect, useRef, useState } from 'react';
import { ILikeableEvent, } from '../../models/Event';
import { Pressable, View, Text, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useMutationLikeOrDislikeEvent } from '../../queries/currentUser/likeEventHooks';
import { ImageBackground } from 'expo-image';
import { Reds, white_50 } from '../../constants/colors';
import { ForEach } from '../utils/ForEach';
//icons
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Condition } from '../utils/ifElse';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { Center } from '../utils/stacks';


interface EventsListProps {
  items: ILikeableEvent[],
  onInfiniteScroll: () => void,
  isFetched: boolean,
  hideLikeAndShareButtons?: boolean,
  targetUserId?: number,
  initialScrollIndex?: number,
}
export const EventsList: FC<EventsListProps> = ({ onInfiniteScroll, isFetched, items, hideLikeAndShareButtons, targetUserId, initialScrollIndex = 0 }) => {
  // const mutateEventLike = useMutationLikeOrDislikeEvent();
  const { theme } = useStyles();

  const onHandleLikeButtonPress = (eventID: number) => {
    // mutateEventLike.mutate({ eventID, targetUserId });
  };
  // const listRef = useRef<FlashList<ILikeableEvent>>(null);

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
          showsVerticalScrollIndicator={false}
          estimatedItemSize={UnistylesRuntime.screen.height}
          // refreshControl={}  // pull to refresh feaature
          pagingEnabled={true}
          data={items}
          onEndReached={onInfiniteScroll}
          onEndReachedThreshold={1}
          renderItem={({ item }) => (
            <EventItem
              hideLikeAndShareButtons={hideLikeAndShareButtons}
              item={item}
              onHandleLikeButtonPress={onHandleLikeButtonPress}
            />
          )}
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


// const SkeletonLoader: FC = () => {
//   const width = Dimensions.get('window').width;
//   const height = Dimensions.get('window').height;

//   return (
//     <>
//       <ContentLoader
//         speed={1}
//         width={width - 20}
//         height={height - 120}
//         viewBox={`0 0 ${width - 20} ${height - 140}`}
//         backgroundColor="#f3f3f3"
//         foregroundColor="#ecebeb"
//       >
//         <Rect x="0" y="0" rx="16" ry="16" width="100%" height="100%" />
//       </ContentLoader>

//       <ContentLoader
//         speed={1}
//         style={{ position: 'absolute', top: 0, left: 0 }}
//         width={width - 20}
//         height={height - 140}
//         viewBox={`0 0 ${width - 20} ${height - 140}`}
//         backgroundColor="#e3e3e3"
//         foregroundColor="#ddd"
//       >
//         <Circle cx={width - 74} cy="84%" r="28" />
//         <Circle cx={width - 74} cy="74%" r="28" />
//         <Circle cx={width - 74} cy="64%" r="28" />
//       </ContentLoader>

//       <ContentLoader
//         speed={1}
//         style={{ position: 'absolute', top: 0, left: 0 }}
//         width={width - 20}
//         height={height - 140}
//         viewBox={`0 0 ${width - 20} ${height - 140}`}
//         backgroundColor="#e3e3e3"
//         foregroundColor="#ddd"
//       >
//         <Circle x="20" cx="20" cy="68%" r="24" />
//         <Rect x="20" y="74%" width="120" height="16" rx="6" ry="6" />
//         <Rect x="20" y="78%" width="140" height="16" rx="6" ry="6" />
//         <Rect x="20" y="82%" width="160" height="16" rx="6" ry="6" />
//         <Rect x="20" y="86%" width="180" height="16" rx="6" ry="6" />
//       </ContentLoader>
//     </>
//   );
// };


// Define the props for the memoized list item
interface ListItemProps {
  item: ILikeableEvent,
  hideLikeAndShareButtons?: boolean,
  onHandleLikeButtonPress: (id: number) => void,
}

const EventItem: FC<ListItemProps> = ({ item, hideLikeAndShareButtons = false, onHandleLikeButtonPress }) => {
  const { styles: stylesEventItem, theme } = useStyles(styleSheet);
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  // const doubleTapOnLikeButton = Gesture.Tap();
  // doubleTapOnLikeButton
  //   .runOnJS(true)
  //   .numberOfTaps(2)
  //   .onEnd(() => onHandleLikeButtonPress(item.id));

  return (
    <ImageBackground
      source={item.photos[0].url}
      style={stylesEventItem.imgBackground}
      placeholder={{ thumbhash: item.photos[0].placeholder }}
      contentFit='cover'
    />
  );
};

// <View style={stylesEventItem.wrapper}>
//   {/* <GestureDetector gesture={doubleTapOnLikeButton}> */}
//   {/* </GestureDetector> */}

//   {/* <View style={stylesEventItem.positionedButtons}>
//     <Condition
//       if={!hideLikeAndShareButtons}
//       then={(
//         <>
//           <View style={{ alignItems: 'center', gap: 2 }}>
//             <Pressable onPress={() => onHandleLikeButtonPress(item.id)}>
//               {({ pressed }) => (
//                 (item.isLiked) ? (
//                   <FontAwesome name='heart' size={28} style={{ color: theme.colors.red100 }} />
//                 ) : (
//                   <FontAwesome name='heart-o' size={28} style={{ color: (pressed) ? theme.colors.red100 : theme.colors.red90 }} />
//                 )
//               )}
//             </Pressable>
//             <Text>{item._count.likes || 0}</Text>
//           </View>

//           <View style={{ alignItems: 'center', gap: 2 }}>
//             <Pressable>
//               {() => (
//                 <FontAwesome name="share" size={28} color="white" />
//                 // <Image style={{ width: 28, height: 28 }} source={icons.share} />
//               )}
//             </Pressable>
//             <Text>{3612}</Text>
//           </View>
//         </>
//       )}
//     />

//     <Pressable>
//       {() => (
//         <FontAwesome6 name="location-dot" size={28} color="white" />
//       )}
//     </Pressable>
//   </View>

//   <View style={stylesEventItem.eventInfoContainer}>
//     <Pressable onPress={() => setIsTextExpanded(prev => !prev)}>
//       <Text
//         // lightColor='#fff'
//         // darkColor='#eee'
//         numberOfLines={isTextExpanded ? 24 : 2}
//         ellipsizeMode='tail'
//         // size='xl'
//         style={{ ...stylesEventItem.textShadow }}
//       >
//         {item.name}
//       </Text>
//     </Pressable>

//     <View style={{ flexDirection: 'row', gap: 10 }}>
//       <ForEach items={item.categories}>
//         {(cat, index) => (
//           <View key={index} style={stylesEventItem.tagContainer}>
//             <Text style={stylesEventItem.tagText}>{cat}</Text>
//           </View>
//         )}
//       </ForEach>
//     </View>

//     <Pressable onPress={() => setIsTextExpanded(prev => !prev)}>
//       {({ pressed }) => (
//         <Text
//           // lightColor='#fff'
//           // darkColor='#eee'
//           numberOfLines={isTextExpanded ? 24 : 2}
//           ellipsizeMode='tail'
//           style={[
//             stylesEventItem.textShadow,
//             {
//               fontSize: 14,
//               opacity: pressed ? 0.84 : 1,
//               backgroundColor: pressed ? 'rgba(255,255,255,0.05)' : 'transparent',
//             }
//           ]}
//         >
//           {item.description}
//         </Text>
//       )}
//     </Pressable>
//   </View> */}
// </View>


const styleSheet = createStyleSheet((theme, runtime) => ({
  eventInfoContainer: {
    bottom: 34,
    gap: 12,
    left: 14,
    position: 'absolute',
    width: '70%',
  },
  imgBackground: {
    height: runtime.screen.height,
    flex: 1,
    width: '100%'
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
    backgroundColor: Reds.RED_500,
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
    textShadowRadius: 10
  },
  wrapper: { flex: 1, position: 'relative' }
}));
