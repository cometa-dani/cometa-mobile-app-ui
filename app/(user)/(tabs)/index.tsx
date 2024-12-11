import { ReactNode } from 'react';
import { EventsList } from '@/components/eventsList/eventsList';
import { CreateEventLike, IGetLatestPaginatedEvents, ILikeableEvent } from '@/models/Event';
import { IGetPaginatedLikedEventsBucketList } from '@/models/LikedEvent';
import { useInfiniteQuerySearchEventsByQueryParams } from '@/queries/currentUser/eventHooks';
import { useMutationLikeOrDislikeEvent } from '@/queries/currentUser/likeEventHooks';
import { QueryKeys } from '@/queries/queryKeys';
import { useCometaStore } from '@/store/cometaStore';
import { InfiniteData, QueryClient, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { SystemBars } from 'react-native-edge-to-edge';


export default function HomeScreen(): ReactNode {
  const queryClient = useQueryClient();
  const searchQuery = useCometaStore(state => state.searchQuery);
  const {
    data,
    isFetched,
    fetchNextPage,
    hasNextPage,
    isFetching
  } = useInfiniteQuerySearchEventsByQueryParams(searchQuery);
  const mutateEventLike = useMutationLikeOrDislikeEvent() as UseMutationResult<CreateEventLike>;
  const evenstData = data?.pages.flatMap(page => page.items) || [];
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();
  return (
    <>
      <SystemBars style='light' />
      <EventsList
        items={evenstData}
        isFetched={isFetched}
        onInfiniteScroll={handleInfiniteFetch}
        onPressLikeButton={handleLikeButton(queryClient, mutateEventLike, searchQuery)}
      />
    </>
  );
}


const handleLikeButton = (
  queryClient: QueryClient,
  mutateEventLike: UseMutationResult<CreateEventLike>,
  searchQuery: string
) => {
  return (event: ILikeableEvent) => {
    const bucketListCache = (
      queryClient
        .getQueryData<InfiniteData<IGetPaginatedLikedEventsBucketList>>
        ([QueryKeys.GET_PAGINATED_LIKED_EVENTS_FOR_BUCKETLIST])
    );
    // Update the likes cache with the new liked state
    queryClient
      .setQueryData<InfiniteData<IGetLatestPaginatedEvents, number>>
      ([QueryKeys.SEARCH_PAGINATED_EVENTS, searchQuery], homeScreenOpimisticUpdate(event));

    // create or delete like
    mutateEventLike.mutate({ eventID: event.id }, {
      onSuccess: async () => {
        if (!bucketListCache?.pages?.length) return;
        await queryClient.invalidateQueries({
          queryKey: [QueryKeys.GET_PAGINATED_LIKED_EVENTS_FOR_BUCKETLIST]
        });
      }
    });

    if (!bucketListCache?.pages?.length) return;
    // Update the bucketlist cache with the new liked state
    queryClient
      .setQueryData<InfiniteData<IGetPaginatedLikedEventsBucketList, number>>
      ([QueryKeys.GET_PAGINATED_LIKED_EVENTS_FOR_BUCKETLIST], bucketListScreenOpimisticUpdate(event));
    //  Invalidate queries after the mutation succeeds
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
