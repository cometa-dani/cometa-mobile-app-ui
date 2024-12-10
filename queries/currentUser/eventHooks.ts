import { useInfiniteQuery } from '@tanstack/react-query';
import { useCometaStore } from '../../store/cometaStore';
import { QueryKeys } from '../queryKeys';
import { IGetLatestPaginatedEvents } from '../../models/Event';
import eventService from '../../services/eventService';
import { IGetPaginatedLikedEventsBucketList } from '../../models/LikedEvent';


// Query to fetch a list of events with infinite scrolling
export const useInfiniteQuerySearchEventsByQueryParams = (eventName = '') => {
  const categoriesSearchFilters = useCometaStore(state => state.searchFilters);
  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.SEARCH_EVENTS_WITH_PAGINATION],
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
      retry: 2,
      retryDelay: 1_000 * 6,
      refetchInterval: 1_000 * 60 * 10
    }));
};


export const useInfiniteQueryGetCurrUserLikedEvents = () => {
  return (
    useInfiniteQuery({
      staleTime: 1_000 * 60 * 5,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      queryKey: [QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST_WITH_PAGINATION],
      initialPageParam: -1,
      queryFn: async ({ pageParam }): Promise<IGetPaginatedLikedEventsBucketList> => {
        const res = await eventService.getLikedEventsByUserIdWithPagination(pageParam, 8);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to request data');
        }
      },
      getNextPageParam: (lastPage) => {
        // stops incrementing next page because there no more events left
        if (lastPage?.hasNextCursor) {
          return lastPage.nextCursor;
        }
        return null; // makes hasNextPage evalutes to false
      },
      retry: 1,
      retryDelay: 1_000 * 6,
    })
  );
};
