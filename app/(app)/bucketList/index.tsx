import React, {FC, ReactNode, useMemo} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { useMutationDeleteLikedEventFromBucketList } from '../../../queries/loggedInUser/likeEventHooks';
import { useInfiniteQueryGetLikedEventsForBucketListByLoggedInUser } from '../../../queries/loggedInUser/eventHooks';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { View, Text } from '../../../components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { gray_50, red_100 } from '../../../constants/colors';
import { If } from '../../../components/utils/ifElse';
import { ForEach } from '../../../components/utils';
import { LikeableEvent } from '../../../models/Event';
import { defaultImgPlaceholder } from '../../../constants/vars';
import { SkeletonLoaderList } from '../../../components/lodingSkeletons/LoadingSkeletonList';
import { EmptyMessage } from '../../../components/empty/Empty';


export default function BuckectListScreen(): ReactNode {
  const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteQueryGetLikedEventsForBucketListByLoggedInUser();
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();
  const memoizedLoggedInUserBucketList = useMemo(() => data?.pages.flatMap(page => page.items) || [], [data?.pages]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar style={'auto'} />
      <If
        condition={isFetching}
        render={<SkeletonLoaderList />}
        elseRender={(
          <If
            condition={!memoizedLoggedInUserBucketList?.length}
            render={(
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 }}>
                <EmptyMessage
                  title='Oops! Looks like your bucket list is empty'
                  subtitle='Head back to the homepage and add some exciting events!'
                />
              </View>
            )}
            elseRender={(
              <FlashList
                data={memoizedLoggedInUserBucketList}
                pagingEnabled={false}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingVertical: 26 }}
                onMomentumScrollEnd={handleInfiniteFetch}
                onEndReachedThreshold={1}
                estimatedItemSize={100}
                renderItem={renderBucketItem}
              />
            )}
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


const renderBucketItem = ({ item, index }: { item: LikeableEvent, index: number }) => {
  return (
    <>
      <BucketItem
        key={item.id}
        item={item}
        index={index}
      />
      <View style={{ height: 20 }} />
    </>
  );
};


// const AnimatedImage  = Animated.createAnimatedComponent(Image);

interface BucketItemProps {
  item: LikeableEvent,
  index: number
}
const BucketItem: FC<BucketItemProps> = ({ item, index }) => {
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
      <Pressable
        onPress={() => router.push(`/matches/${item.id}?eventIndex=${index}`)}
      >
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
