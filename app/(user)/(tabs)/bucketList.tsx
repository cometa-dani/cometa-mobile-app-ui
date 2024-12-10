import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import React, { FC } from 'react';
import { SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { RectButton } from 'react-native-gesture-handler';
import { useMutationDeleteLikedEventFromBucketList } from '../../../queries/currentUser/likeEventHooks';
import { useInfiniteQueryGetCurrUserLikedEvents } from '../../../queries/currentUser/eventHooks';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { red_100 } from '../../../constants/colors';
import { ILikedEvent } from '../../../models/Event';
import { defaultImgPlaceholder } from '../../../constants/vars';
import { EmptyMessage } from '../../../legacy_components/empty/Empty';
import { ForEach } from '@/components/utils/ForEach';
import { Condition } from '@/components/utils/ifElse';
import { Center, HStack, VStack } from '@/components/utils/stacks';
import { tabBarHeight } from '@/components/tabBar/tabBar';
import { TextView } from '@/components/text/text';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';


export default function BucketListScreen() {
  return (
    <>
      <SystemBars style='dark' />
      <BuckectList />
    </>
  );
}


const BuckectList: FC = () => {
  const { theme } = useStyles();
  const {
    data,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetched,
    refetch,
    isStale
  } = useInfiniteQueryGetCurrUserLikedEvents();
  useRefreshOnFocus(refetch, isStale);
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
                showsVerticalScrollIndicator={true}
                estimatedItemSize={112}
                contentContainerStyle={{ paddingVertical: theme.spacing.sp8 }}
                ListFooterComponentStyle={{ height: tabBarHeight * 2 }}
                ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp8 }} />}
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
};


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
  deleteButton: {
    backgroundColor: theme.colors.red50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginRight: theme.spacing.sp7,
    padding: 10,
  },
  img: {
    borderRadius: theme.spacing.sp8,
    height: 112,
    width: '40%',
  }
}));


const renderBucketItem = ({ item, index }: { item: ILikedEvent, index: number }) => {
  return (
    <BucketItem
      item={item}
      index={index}
    />
  );
};


interface BucketItemProps {
  item: ILikedEvent,
  index: number
}
const BucketItem: FC<BucketItemProps> = ({ item, index }) => {
  const { styles, theme } = useStyles(styleSheet);
  const deleteLikedEventMutation = useMutationDeleteLikedEventFromBucketList();

  const UsersBubbles: FC = () => (
    <ForEach items={item?.event.likes ?? []}>
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
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.white80,
          paddingHorizontal: theme.spacing.sp6,
          gap: theme.spacing.sp2
        }}
        onPress={() => router.push(`/matches/${item.id}?eventIndex=${index}`)}
      >
        <HStack gap={theme.spacing.sp4}>
          <Image
            source={{ uri: item?.event.photos[0]?.url ?? '' }}
            placeholder={{ thumbhash: item?.event.photos[0]?.placeholder }}
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
              {item?.event.name}
            </TextView>
            <TextView
              numberOfLines={2}
              ellipsis={true}
              style={{
                fontSize: 13.6,
                color: theme.colors.gray400
              }}
            >
              {item?.event.description}
            </TextView>
          </VStack>
        </HStack>

        <HStack gap={theme.spacing.sp2}>
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.white60,
              paddingVertical: theme.spacing.sp1,
              paddingHorizontal: 6,
              borderRadius: theme.spacing.sp2,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              gap: theme.spacing.sp1
            }}
          >
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={theme.spacing.sp6}
              style={{ color: theme.colors.indigo600 }}
            />
            <TextView
              ellipsis={true}
              style={{
                width: 100,
                fontSize: 13,
                fontFamily: theme.text.fontMedium,
                color: theme.colors.indigo600
              }}
            >
              {item.event.location?.name}
            </TextView>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.white60,
              paddingVertical: theme.spacing.sp1,
              paddingHorizontal: 6,
              borderRadius: theme.spacing.sp2,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              gap: theme.spacing.sp1
            }}
          >
            <MaterialCommunityIcons
              name="calendar-outline"
              size={theme.spacing.sp6}
              style={{ color: theme.colors.lime600 }}
            />
            <TextView
              ellipsis={true}
              style={{
                width: 80,
                fontSize: 13,
                fontFamily: theme.text.fontMedium,
                color: theme.colors.lime600
              }}
            >
              {new Date(item?.event.date).toDateString().split(' ').slice(1).join(' ')}
            </TextView>
          </TouchableOpacity>

          <View style={styles.bubblesContainer}>
            <UsersBubbles />
          </View>
        </HStack>
      </TouchableOpacity>
    </Swipeable>
  );
};
