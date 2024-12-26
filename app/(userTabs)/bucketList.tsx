import { TouchableOpacity, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { FC, ReactNode, useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { RectButton } from 'react-native-gesture-handler';
import { FlashList } from '@shopify/flash-list';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { ForEach } from '@/components/utils/ForEach';
import { Condition } from '@/components/utils/ifElse';
import { Center, HStack, VStack } from '@/components/utils/stacks';
import { tabBarHeight } from '@/components/tabBar/tabBar';
import { TextView } from '@/components/text/text';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { InfiniteData, QueryClient, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { IGetPaginatedLikedEventsBucketList } from '@/models/LikedEvent';
import { QueryKeys } from '@/queries/queryKeys';
import { useCometaStore } from '@/store/cometaStore';
import { useRouter } from 'expo-router';
import { CreateEventLike, IGetLatestPaginatedEvents, ILikedEvent } from '@/models/Event';
import { useInfiniteQueryGetBucketListScreen } from '@/queries/currentUser/eventHooks';
import { useMutationLikeOrDislikeEvent } from '@/queries/currentUser/likeEventHooks';
import { defaultImgPlaceholder } from '@/constants/vars';
import { EmptyMessage } from '@/components/empty/Empty';
import Skeleton, { SkeletonLoading } from 'expo-skeleton-loading';


export default function BucketListScreen() {
  return (
    <>
      <SystemBars style='dark' />
      <BuckectList />
    </>
  );
}


const handleDeleteEventLike = (
  queryClient: QueryClient,
  mutation: UseMutationResult<CreateEventLike>,
  searchQuery: string
) => {
  return async function (eventID: number) {
    queryClient
      .setQueryData<InfiniteData<IGetPaginatedLikedEventsBucketList, number>>
      ([QueryKeys.GET_PAGINATED_LIKED_EVENTS_FOR_BUCKETLIST], (oldData) => ({
        pages: oldData?.pages.map(
          (page) => (
            {
              ...page,
              items: page.items.filter(item => eventID !== item.event.id)
            }
          )) || [],
        pageParams: oldData?.pageParams || []
      }));
    queryClient
      .setQueryData<InfiniteData<IGetLatestPaginatedEvents, number>>
      ([QueryKeys.SEARCH_PAGINATED_EVENTS, searchQuery], (oldData) => ({
        pages: oldData?.pages.map(
          (page) => (
            {
              ...page,
              items: page.items.map(item =>
                eventID === item.id ? (
                  {
                    ...item,
                    isLiked: false,
                    _count: {
                      ...item._count,
                      likes: item._count.likes - 1
                    }
                  }
                ) :
                  item
              )
            }
          )) || [],
        pageParams: oldData?.pageParams || []
      }));
    mutation.mutate({ eventID });
  };
};


const BuckectList: FC = () => {
  const { theme } = useStyles();
  const searchQuery = useCometaStore(state => state.searchQuery);
  const queryClient = useQueryClient();
  const {
    data,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetched,
    isPending,
  } = useInfiniteQueryGetBucketListScreen();
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();
  const bucketList = data?.pages.flatMap(page => page.items) || [];
  const mutation = useMutationLikeOrDislikeEvent() as UseMutationResult<CreateEventLike>;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Condition
        if={isFetched && !isPending}
        then={
          <Condition
            if={!bucketList?.length}
            then={(
              <Center styles={{ flex: 1, padding: 34, paddingTop: 0 }}>
                <EmptyMessage
                  title='Oops! Looks like your bucket list is empty'
                  subtitle='Head back to the homepage and add some exciting events!'
                />
              </Center>
            )}
            else={(
              <FlashList
                data={bucketList}
                showsVerticalScrollIndicator={true}
                estimatedItemSize={112}
                contentContainerStyle={{ paddingVertical: theme.spacing.sp6 }}
                ListFooterComponentStyle={{ height: tabBarHeight * 2 }}
                ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp8 }} />}
                onEndReachedThreshold={0.5}
                onEndReached={handleInfiniteFetch}
                renderItem={renderBucketItem(handleDeleteEventLike(queryClient, mutation, searchQuery))}
              />
            )}
          />
        }
        else={(<SkeletonList />)}
      />
    </SafeAreaView>
  );
};


const renderBucketItem = (onDeleteEventLike: (eventID: number) => void) => {
  return function item({ item, index }: { item: ILikedEvent, index: number }) {
    return (
      <BucketItem
        item={item}
        onDeleteEventLike={onDeleteEventLike}
      />
    );
  };
};


interface BucketItemProps {
  item: ILikedEvent,
  onDeleteEventLike: (eventID: number) => void
}
const BucketItem: FC<BucketItemProps> = ({ item, onDeleteEventLike }) => {
  const setLikedEvent = useCometaStore(state => state.setLikedEvent);
  const { styles, theme } = useStyles(styleSheet);
  const eventDate = useMemo(() => new Date(item?.event.date).toDateString().split(' ').slice(1).join(' '), []);
  const router = useRouter();

  const UsersBubbles: FC = useCallback(() => (
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
  ), []);

  return (
    <Swipeable
      renderRightActions={
        (_a, _b, swipeable) => (
          <RectButton
            onPress={() => {
              swipeable?.close();
              onDeleteEventLike(item.event.id);
            }}
            style={styles.deleteButton}
          >
            <FontAwesome
              name='trash-o'
              size={22}
              color={theme.colors.red100}
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
        onPress={() => {
          router.push(`/(userStacks)/matches?eventId=${item.event.id}`);
          setLikedEvent(item.event);
        }}
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
                fontFamily: theme.text.fontSemibold
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
              {eventDate}
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

const MySkeleton = Skeleton as FC<SkeletonLoading & { children: ReactNode }>;


const SkeletonList: FC = () => {
  const { theme, styles } = useStyles(styleSheet);
  return (
    <FlashList
      data={[1, 2, 3, 4, 5, 6]}
      estimatedItemSize={112}
      contentContainerStyle={{ paddingVertical: theme.spacing.sp6 }}
      ListFooterComponentStyle={{ height: tabBarHeight * 2 }}
      ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp8 }} />}
      renderItem={() => (
        <MySkeleton background={theme.colors.gray200} highlight={theme.colors.slate100}>
          <TouchableOpacity
            style={{
              paddingHorizontal: theme.spacing.sp6,
              gap: theme.spacing.sp2
            }}
          >
            <HStack gap={theme.spacing.sp4}>
              <View
                style={[styles.img, { backgroundColor: theme.colors.gray200 }]}
              />
              <VStack $y='center' gap={theme.spacing.sp2} styles={{ flex: 1 }}>
                <View style={{
                  backgroundColor: theme.colors.gray200,
                  height: 16,
                  width: '60%',
                  flexDirection: 'row',
                  borderRadius: 10
                }} />
                <View style={{
                  backgroundColor: theme.colors.gray200,
                  height: 16,
                  width: '100%',
                  flexDirection: 'row',
                  borderRadius: 10
                }} />
                <View style={{
                  backgroundColor: theme.colors.gray200,
                  height: 16,
                  width: '100%',
                  flexDirection: 'row',
                  borderRadius: 10
                }} />
              </VStack>
            </HStack>

            <HStack gap={theme.spacing.sp2}>
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.gray200,
                  paddingVertical: theme.spacing.sp1,
                  paddingHorizontal: 6,
                  borderRadius: theme.spacing.sp2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: theme.spacing.sp1,
                  flex: 1
                }}
              >
                <View style={{
                  backgroundColor: theme.colors.gray200,
                  height: 16,
                  width: '60%',
                  flexDirection: 'row',
                  borderRadius: 10
                }} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.gray200,
                  paddingVertical: theme.spacing.sp1,
                  paddingHorizontal: 6,
                  borderRadius: theme.spacing.sp2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: theme.spacing.sp1,
                  flex: 1
                }}
              >
                <View style={{
                  backgroundColor: theme.colors.gray200,
                  height: 16,
                  width: '60%',
                  flexDirection: 'row',
                  borderRadius: 10
                }} />
              </TouchableOpacity>
            </HStack>
          </TouchableOpacity>
        </MySkeleton>
      )}
    />
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
    borderRadius: theme.spacing.sp7,
    height: 112,
    width: '40%',
  }
}));
