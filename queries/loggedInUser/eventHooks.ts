import { useInfiniteQuery } from '@tanstack/react-query';
import { useCometaStore } from '../../store/cometaStore';
import { QueryKeys } from '../queryKeys';
import { GetAllLatestEventsWithPagination } from '../../models/Event';
import eventService from '../../services/eventService';
import { GetLikedEventsForBucketListWithPagination } from '../../models/LikedEvent';


// Query to fetch a list of events with infinite scrolling
export const useInfiniteQuerySearchEventsByQueryParams = (eventName = '') => {
  const accessToken = useCometaStore(state => state.accessToken);
  const categoriesSearchFilters = useCometaStore(state => state.searchFilters);

  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.SEARCH_EVENTS_WITH_PAGINATION, eventName],
      initialPageParam: -1,
      queryFn: async ({ pageParam }): Promise<GetAllLatestEventsWithPagination> => {
        const res =
          await eventService.searchEventsWithPagination({
            cursor: pageParam,
            limit: 10,
            loggedInUserAccessToken: accessToken,
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


export const useInfiniteQueryGetLikedEventsForBucketListByLoggedInUser = () => {
  const loggedInUserAccessToken = useCometaStore(state => state.accessToken);

  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST_BY_LOGGED_IN_USER_WITH_PAGINATION],
      initialPageParam: -1,
      // select(data): GetLikedEventsForBucketListWithPagination{
      //   return data?.pages.flatMap(page => page.events) ;
      // },
      queryFn: async ({ pageParam }): Promise<GetLikedEventsForBucketListWithPagination> => {
        const res = await eventService.getLikedEventsByUserIdWithPagination(pageParam, 8, loggedInUserAccessToken);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to request data');
        }
      },
      // Define when to stop refetching
      getNextPageParam: (lastPage) => {
        // stops incrementing next page because there no more events left
        if (!lastPage.nextCursor || lastPage.events.length < 8) {
          return null; // makes hasNextPage evalutes to false
        }
        return lastPage.nextCursor;
      },
      retry: 2,
      retryDelay: 1_000 * 6,
    })
  );
};
