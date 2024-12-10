import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import React, { FC, ReactNode, useMemo } from 'react';
import { Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { RectButton } from 'react-native-gesture-handler';
import { useMutationDeleteLikedEventFromBucketList } from '../../../queries/currentUser/likeEventHooks';
import { useInfiniteQueryGetLikedEventsForBucketListByLoggedInUser } from '../../../queries/currentUser/eventHooks';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { FontAwesome } from '@expo/vector-icons';
import { gray_50, red_100 } from '../../../constants/colors';
import { ILikeableEvent } from '../../../models/Event';
import { defaultImgPlaceholder } from '../../../constants/vars';
import { EmptyMessage } from '../../../legacy_components/empty/Empty';
import { ForEach } from '@/components/utils/ForEach';
import { Condition } from '@/components/utils/ifElse';
import { Center, HStack, VStack } from '@/components/utils/stacks';
import { tabBarHeight } from '@/components/tabBar/tabBar';
import { Heading } from '@/components/text/heading';
import { TextView } from '@/components/text/text';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';


export default function BucketListScreen() {
  const { styles } = useStyles(stylesheet);
  return (
    <>
      <SystemBars style='dark' />
      <BuckectList />
    </>
  );
}

const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    // backgroundColor: theme.colors.white100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
}));


export function BuckectList(): ReactNode {
  const { theme } = useStyles();
  const { data, isFetching, hasNextPage, fetchNextPage, isFetched } = useInfiniteQueryGetLikedEventsForBucketListByLoggedInUser();
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();
  const bucketList = data?.pages.flatMap(page => page.items) || [];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Condition
        if={isFetched}
        then={
          <Condition
            if={!bucketList?.length}
            then={(
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 }}>
                <EmptyMessage
                  title='Oops! Looks like your bucket list is empty'
                  subtitle='Head back to the homepage and add some exciting events!'
                />
              </View>
            )}
            else={(
              <FlashList
                data={bucketList}
                pagingEnabled={false}
                showsVerticalScrollIndicator={true}
                estimatedItemSize={112}
                contentContainerStyle={{ paddingVertical: theme.spacing.sp8 }}
                ListFooterComponentStyle={{ height: tabBarHeight * 2 }}
                ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp4 }} />}
                onEndReachedThreshold={0.5}
                onEndReached={handleInfiniteFetch}
                renderItem={renderBucketItem}
              />
            )}
          />
        }
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
    </SafeAreaView>
  );
}

const styleSheet = createStyleSheet((theme) => ({
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
  // date: {
  //   fontSize: 14,
  //   textAlign: 'center'
  // },
  deleteButton: {
    backgroundColor: theme.colors.red50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginRight: theme.spacing.sp7,
    padding: 10,
  },
  // eventContainer: {
  //   flex: 1,
  //   flexDirection: 'row',
  // },
  img: {
    borderRadius: theme.spacing.sp8,
    height: 112,
    width: '40%',
  },
  // textContainer: {
  //   flexDirection: 'column',
  //   justifyContent: 'space-around',
  //   width: '34%',
  // },
  // title: {
  //   fontWeight: '500',
  //   textAlign: 'center',
  // }
}));


const renderBucketItem = ({ item, index }: { item: ILikeableEvent, index: number }) => {
  return (
    <BucketItem
      item={item}
      index={index}
    />
  );
};


// const AnimatedImage  = Animated.createAnimatedComponent(Image);

interface BucketItemProps {
  item: ILikeableEvent,
  index: number
}
const BucketItem: FC<BucketItemProps> = ({ item, index }) => {
  const { styles, theme } = useStyles(styleSheet);
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
    <Swipeable
      renderRightActions={
        () => (
          <RectButton
            onPress={() => deleteLikedEventMutation.mutate(item.id)}
            style={styles.deleteButton}
          >
            <FontAwesome
              name='trash-o'
              size={22}
              color={red_100}
            />
          </RectButton>
        )
      }
    >
      <TouchableOpacity onPress={() => router.push(`/matches/${item.id}?eventIndex=${index}`)}>
        <HStack styles={{
          gap: theme.spacing.sp4,
          backgroundColor: theme.colors.white70,
          paddingHorizontal: theme.spacing.sp6
        }}>
          <Image
            source={{ uri: item?.photos[0]?.url ?? '' }}
            placeholder={{ thumbhash: item?.photos[0]?.placeholder }}
            style={styles.img}
          />
          <VStack $y='center' gap={theme.spacing.sp2} styles={{ flex: 1 }}>
            <TextView
              numberOfLines={2}
              ellipsis={true}
              style={{
                fontSize: 14.8,
                fontFamily: theme.text.fontMedium
              }}
            >
              {item?.name}
            </TextView>
            <TextView
              numberOfLines={2}
              ellipsis={true}
              style={{
                fontSize: 13.6,
                color: theme.colors.gray400
              }}
            >
              {item?.description}
            </TextView>
            {/* <TextView ellipsis={true} style={{ fontSize: 14 }}>
              {new Date(item?.date).toDateString()}
            </TextView> */}
          </VStack>
        </HStack>

        <View style={styles.bubblesContainer}>
          <UsersBubbles />
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};
