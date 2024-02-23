import React, { FC, Fragment, memo, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { useInfiniteQueryGetLikedEventsByLoggedInUser, useMutationDeleteLikedEventFromBucketList } from '../../queries/eventHooks';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { View, Text } from '../../components/Themed';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { FontAwesome } from '@expo/vector-icons';
import { gray_50, red_100 } from '../../constants/colors';
import { If } from '../../components/utils/ifElse';
import { ForEach } from '../../components/utils';
import { LikeableEvent } from '../../models/Event';
import { defaultImgPlaceholder } from '../../constants/vars';


export default function BuckectListScreen(): JSX.Element {
  const { data, isFetching, hasNextPage, fetchNextPage, isLoading, } = useInfiniteQueryGetLikedEventsByLoggedInUser();
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();
  const loggedInUserBucketList = useMemo(() => data?.pages.flatMap(page => page.events) || [], [data?.pages]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar style={'auto'} />
      <If
        condition={isLoading}
        render={<SkeletonLoader />}
        elseRender={(
          <FlashList
            data={loggedInUserBucketList}
            pagingEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 26 }}
            onMomentumScrollEnd={handleInfiniteFetch}
            onEndReachedThreshold={1}
            estimatedItemSize={100}
            renderItem={renderMemoizedBucketItem}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  bubble: {
    aspectRatio: 1,
    borderRadius: 100,
    height: 30,
  },

  bubblesContainer: {
    flexDirection: 'row',
    flex: 0,
    gap: -11,
    justifyContent: 'flex-start',
  },

  date: {
    color: 'gray',
    fontSize: 14,
    textAlign: 'center'
  },

  deleteButton: {
    backgroundColor: gray_50,
    borderRadius: 20,
    justifyContent: 'center',
    marginRight: 20,
    padding: 24
  },

  eventContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
  },

  img: {
    borderRadius: 26,
    height: 108,
    width: '40%',
  },

  textContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '34%',
  },

  title: {
    fontWeight: '500',
    textAlign: 'center',
  }
});


const renderMemoizedBucketItem = ({ item }: { item: LikeableEvent }) => {
  return (
    <>
      <MemoizedBucketItem
        key={item.id}
        item={item}
      />
      <View style={{ height: 20 }} />
    </>
  );
};


const SkeletonLoader: FC = () => {
  const windowWidth = Dimensions.get('window').width;
  const itemWidth = windowWidth - 40; // Subtract padding
  const itemHeight = 108;
  const gap = 20;
  const totalHeight = 6 * (itemHeight + gap);

  const rect1Width = itemWidth * 0.40; // 35% of item width
  const rect2Width = itemWidth * 0.60; // 51% of item width
  const rect2X = rect1Width + 20; // Start of second rect, add 20 for gap

  return (
    <ContentLoader
      speed={1}
      style={{ marginVertical: 26 }}
      width={windowWidth}
      height={totalHeight}
      viewBox={`0 0 ${windowWidth} ${totalHeight}`}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Fragment key={i}>
          <Rect
            x="20"
            y={i * (itemHeight + gap) + 6}
            rx="26"
            ry="26"
            width={rect1Width}
            height={itemHeight}
          />
          <Rect
            x={rect2X + 10}
            y={i * (itemHeight + gap) + 6}
            rx="26"
            ry="26"
            width={rect2Width - 10}
            height={itemHeight}
          />
        </Fragment>
      ))}
    </ContentLoader>
  );
};


interface BucketItemProps {
  item: LikeableEvent,
}
const BucketItem: FC<BucketItemProps> = ({ item }) => {
  const deleteLikedEventMutation = useMutationDeleteLikedEventFromBucketList();

  const UsersBubbles: FC = () => (
    <ForEach items={item?.likes ?? []}>
      {({ user }, index) => (
        <Image
          key={index}
          source={{ uri: user?.photos[0]?.url ?? defaultImgPlaceholder }}
          placeholder={{ thumbhash: user?.photos[0]?.placeholder }}
          style={styles.bubble}
        />
      )}
    </ForEach>
  );

  return (
    <Swipeable renderRightActions={
      () => (
        <RectButton onPress={() => deleteLikedEventMutation.mutate(item.id)} style={styles.deleteButton}>
          <FontAwesome name='trash-o' size={32} color={red_100} />
        </RectButton>
      )
    }>
      <Pressable onPress={() => router.push(`/matchedEvents/${item.id}`)}>
        {({ pressed }) => (
          <View style={[styles.eventContainer, { opacity: pressed ? 0.8 : 1 }]}>
            <Image
              source={{ uri: item?.photos[0]?.url ?? '' }}
              placeholder={{ thumbhash: item?.photos[0]?.placeholder }}
              style={styles.img}
            />

            <View style={styles.textContainer}>
              <Text style={styles.title}>{item?.name}</Text>

              <Text style={styles.date}>{new Date(item?.date).toDateString()}</Text>
            </View>

            <View style={styles.bubblesContainer}>
              <UsersBubbles />
            </View>
          </View>
        )}
      </Pressable>
    </Swipeable>
  );
};

const MemoizedBucketItem = memo(BucketItem, areEqual);

function areEqual(prevProps: BucketItemProps, nextProps: BucketItemProps) {
  return prevProps.item.id === nextProps.item.id;
}
