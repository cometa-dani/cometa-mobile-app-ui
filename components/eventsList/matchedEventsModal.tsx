import { FC } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { create } from 'zustand';
import { EventsList } from './eventsList';
import { useInfiniteQueryGetSameMatchedEventsByTwoUsers } from '@/queries/targetUser/eventHooks';
import { InfiniteData, QueryClient, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { useCometaStore } from '@/store/cometaStore';
import { useMutationLikeOrDislikeEvent } from '@/queries/currentUser/likeEventHooks';
import { CreateEventLike, IGetLatestPaginatedEvents, ILikeableEvent } from '@/models/Event';
import { IGetPaginatedLikedEventsBucketList } from '@/models/LikedEvent';
import { QueryKeys } from '@/queries/queryKeys';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { HStack } from '../utils/stacks';
import { Image } from 'expo-image';
import { imageTransition } from '@/constants/vars';
import { AntDesign } from '@expo/vector-icons';
import { CircleButton } from '../button/circleButton';


export const MatcheEventsModal: FC = () => {
  const { toggle, onToggle } = useMacthedEvents();
  const queryClient = useQueryClient();
  const { theme, styles } = useStyles(stylesheet);
  const targetUser = useCometaStore(state => state.targetUser);
  const currentUser = useCometaStore(state => state.userProfile);
  // const searchQuery = useCometaStore(state => state.searchQuery);
  const {
    data,
    isFetched,
    fetchNextPage,
    hasNextPage,
    isFetching
  } = useInfiniteQueryGetSameMatchedEventsByTwoUsers(targetUser?.uid ?? '');
  const mutateEventLike = useMutationLikeOrDislikeEvent() as UseMutationResult<CreateEventLike>;
  const evenstData = data?.pages.flatMap(page => page.items) || [];
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();
  return (
    <Modal
      animationType='slide'
      visible={toggle}
      onRequestClose={onToggle}
      // statusBarTranslucent={true}
      style={{ position: 'relative', zIndex: 10, flex: 1 }}
    >
      <EventsList
        items={evenstData}
        isFetched={isFetched}
        onInfiniteScroll={handleInfiniteFetch}
        hideLikeButton={true}
        onPressLikeButton={(props) => console.log('clicked', props)}
        header={() => (
          <HStack $x='center' $y='center' styles={styles.avatarContainer}>
            <View style={styles.closeButton}>
              <CircleButton onPress={() => onToggle()}>
                <AntDesign
                  name="close"
                  size={theme.spacing.sp8}
                  color={theme.colors.white100}
                />
              </CircleButton>
            </View>
            <View style={styles.avatar}>
              <Image
                style={styles.img}
                contentFit='cover'
                transition={imageTransition}
                source={{ uri: currentUser?.photos?.at(0)?.url }}
                placeholder={{ thumbhash: currentUser?.photos?.at(0)?.placeholder }}
              />
            </View>
            <View style={styles.avatar}>
              <Image
                style={styles.img}
                contentFit='cover'
                transition={imageTransition}
                source={{ uri: targetUser?.photos?.at(0)?.url }}
                placeholder={{ thumbhash: targetUser?.photos?.at(0)?.placeholder }}
              />
            </View>
          </HStack>
        )}
      />
    </Modal>
  );
};


const stylesheet = createStyleSheet((theme, runtime) => ({
  avatarContainer: {
    width: runtime.screen.width,
    shadowColor: theme.colors.white100,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
    position: 'relative',
  },
  avatar: {
    aspectRatio: 1,
    borderColor: theme.colors.white90,
    borderRadius: 99_9999,
    overflow: 'hidden',
    borderWidth: 2,
    height: 70,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    left: theme.spacing.sp6,
    top: 0
  },
  imgBackground: {
    flex: 1,
    position: 'relative',
  },
  linearGradientTop: {
    position: 'absolute',
    top: 0,
    height: 310,
    width: '100%'
  },
  linearGradient: {
    position: 'absolute',
    bottom: 0,
    height: 290,
    width: '100%',
    justifyContent: 'flex-end'
  },
  buttonsContainer: {
    padding: theme.spacing.sp10,
    paddingBottom: theme.spacing.sp18 + runtime.insets.bottom
  },
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.backDrop,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sp7,
    paddingBottom: runtime.insets.bottom,
  },
  modal: {
    position: 'relative',
    width: '100%',
    backgroundColor: theme.colors.blue100,
    padding: theme.spacing.sp10,
    borderRadius: theme.radius.md,
    minHeight: 300,
  },
  logo: {
    width: 48,
    aspectRatio: 1
  }
}));


type ModalSlice = {
  toggle: boolean
  onToggle: () => void
};

export const useMacthedEvents = create<ModalSlice>((set, get) => ({
  toggle: false,
  onToggle: () => set({ toggle: !get().toggle })
}));


const handleLikeButton = (
  queryClient: QueryClient,
  mutateEventLike: UseMutationResult<CreateEventLike>,
  // searchQuery: string
) => {
  return (event: ILikeableEvent) => {
    const bucketListCache = (
      queryClient
        .getQueryData<InfiniteData<IGetPaginatedLikedEventsBucketList>>
        ([QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST])
    );
    // Update the likes cache with the new liked state
    queryClient
      .setQueryData<InfiniteData<IGetLatestPaginatedEvents, number>>
      ([QueryKeys.SEARCH_EVENTS_BY_NAME], homeScreenOpimisticUpdate(event));

    // create or delete like
    mutateEventLike.mutate({ eventID: event.id });

    if (!bucketListCache?.pages?.length) return;
    // Update the bucketlist cache with the new liked state
    queryClient
      .setQueryData<InfiniteData<IGetPaginatedLikedEventsBucketList, number>>
      ([QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST], bucketListScreenOpimisticUpdate(event));
  };
};


// Update the cache with the new liked state in the HOME screen
const homeScreenOpimisticUpdate = (event: ILikeableEvent) => {
  const { isLiked } = event;
  return (oldData?: InfiniteData<IGetLatestPaginatedEvents, number>) => {
    return {
      pages: oldData?.pages.map(
        (page) => (
          {
            ...page,
            items: page.items.map(
              item => item.id === event.id ?
                {
                  ...item,
                  isLiked: !isLiked
                } :
                item
            ) ?? []
          }
        )) ?? [],
      pageParams: oldData?.pageParams || []
    };
  };
};


// Update the cache with the new liked state in the BUCKETLIST screen
const bucketListScreenOpimisticUpdate = (event: ILikeableEvent) => {
  const { isLiked } = event;
  return (oldata?: InfiniteData<IGetPaginatedLikedEventsBucketList, number>) => {
    const lastLikedEvent = oldata?.pages.at(-1)?.items.at(-1);
    const newEvent = { isLiked: true, event: event, id: (lastLikedEvent?.id ?? 0) + 1 };
    const addNewEvent = (page: IGetPaginatedLikedEventsBucketList, index: number) => (
      index === 0 ?
        {
          ...page,
          items: [newEvent, ...page.items]
        } :
        page
    );
    const removeEvent = (page: IGetPaginatedLikedEventsBucketList, index: number) => (
      index === 0 ?
        {
          ...page,
          items: page.items.filter(item => item.event.id !== newEvent.event.id)
        } :
        page
    );
    return {
      pages: oldata?.pages.map(isLiked ? removeEvent : addNewEvent) || [],
      pageParams: oldata?.pageParams || []
    };
  };
};
