import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCometaStore } from '../../store/cometaStore';
import { IGetLatestPaginatedEvents } from '../../models/Event';
import eventService from '../../services/eventService';
import { IGetPaginatedLikedEventsBucketList } from '../../models/LikedEvent';
import { useEffect } from 'react';
import { QueryKeys } from '../queryKeys';


// Query to fetch a list of events with infinite scrolling
export const useInfiniteQueryGetEventsHomeScreen = (eventName?: string) => {
  const categoriesSearchFilters = useCometaStore(state => state.searchFilters);
  const isAuthenticated = useCometaStore(state => state.isAuthenticated);
  return (
    useInfiniteQuery({
      enabled: isAuthenticated,
      queryKey: [QueryKeys.SEARCH_EVENTS_BY_NAME, eventName],
      initialPageParam: -1,
      queryFn: async ({ pageParam }): Promise<IGetLatestPaginatedEvents> => {
        const res =
          await eventService.searchEventsWithPagination({
            cursor: pageParam,
            limit: 10,
            name: eventName,
            categories: categoriesSearchFilters
          });
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to request data');
        }
      },
      // Define when to stop refetching
      getNextPageParam: (lastPage) => {
        if (lastPage.hasNextCursor) {
          return lastPage.nextCursor;
        }
        return null; // makes hasNextPage evalutes to false
      },
      refetchInterval: 1_000 * 60 * 10  // 10 minutes
    }));
};


export const useInfiniteQueryGetBucketListScreen = () => {
  const isAuthenticated = useCometaStore(state => state.isAuthenticated);
  return (
    useInfiniteQuery({
      enabled: isAuthenticated,
      queryKey: [QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST],
      initialPageParam: -1,
      queryFn: async ({ pageParam }): Promise<IGetPaginatedLikedEventsBucketList> => {
        const res = await eventService.getLikedEventsByUserIdWithPagination(pageParam = -1, 8);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to request data');
        }
      },
      getNextPageParam: (lastPage) => {
        if (lastPage?.hasNextCursor) {
          return lastPage.nextCursor;
        }
        return null; // makes hasNextPage evalutes to false
      }
    })
  );
};


export const usePrefetchBucketList = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = useCometaStore(state => state.isAuthenticated);
  useEffect(() => {
    if (!isAuthenticated) return;
    queryClient.prefetchInfiniteQuery({
      queryKey: [QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST],
      initialPageParam: -1,
      pages: 1,
      queryFn: async ({ pageParam }): Promise<IGetPaginatedLikedEventsBucketList> => {
        const res = await eventService.getLikedEventsByUserIdWithPagination(pageParam = -1, 8);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to request data');
        }
      },
      getNextPageParam: (lastPage) => lastPage?.hasNextCursor ? lastPage.nextCursor : null,
    })
      .then()
      .catch();
  }, [isAuthenticated]);
};


export const useQueryCachedBucketListItem = (eventIndex: number) => {
  const queryClient = useQueryClient();
  const bucketListCahedData = (
    queryClient
      .getQueryData<InfiniteData<IGetPaginatedLikedEventsBucketList, number>>
      ([QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST])
  );
  const eventByIdCachedData = (bucketListCahedData?.pages.flatMap(page => page?.items) ?? []).at(eventIndex);
  return eventByIdCachedData;
};
