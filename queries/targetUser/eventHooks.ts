import { useInfiniteQuery } from '@tanstack/react-query';
import { useCometaStore } from '../../store/cometaStore';
import eventService from '../../services/eventService';
import { GetLikedEventsForBucketListWithPagination } from '../../models/LikedEvent';
import { GetMatchedUsersWhoLikedEventWithPagination } from '../../models/User';
import { QueryKeys } from '../queryKeys';


export const useInfiniteQueryGetLikedEventsForBucketListByTargerUser = (targetUserId?: number) => {
  const firstUserAccessToken = useCometaStore(state => state.accessToken);
  return (
    useInfiniteQuery({
      enabled: !!targetUserId,
      queryKey: [QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST_BY_TARGET_USER_ID_WITH_PAGINATION, targetUserId],
      initialPageParam: -1,
      queryFn: async ({ pageParam }): Promise<GetLikedEventsForBucketListWithPagination> => {
        const res = await eventService.getLikedEventsByUserIdWithPagination(pageParam, 4, firstUserAccessToken, targetUserId);
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
        if (lastPage?.hasNextCursor) {
          return lastPage.nextCursor;
        }
        return null; // makes hasNextPage evalutes to false
      },
      retry: 2,
      retryDelay: 1_000 * 6
    })
  );
};


// Query to fetch users who liked the same event with infinite scrolling
export const useInfiteQueryGetUsersWhoLikedSameEventByID = (eventID: number) => {
  const accessToken = useCometaStore(state => state.accessToken);
  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT_WITH_PAGINATION, +eventID],
      initialPageParam: -1,
      enabled: !!eventID,
      queryFn: async ({ pageParam }): Promise<GetMatchedUsersWhoLikedEventWithPagination> => {
        const res = await eventService.getAllUsersWhoLikedSameEventWithPagination(eventID, pageParam, 5, accessToken);
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
        if (lastPage.hasNextCursor) {
          return lastPage.nextCursor;
        }
        return null; // makes hasNextPage evalutes to false
      },
      retry: 2,
      retryDelay: 1_000 * 6,
      refetchInterval: 1_000 * 60 * 10
    })
  );
};


export const useInfiniteQueryGetSameMatchedEventsByTwoUsers = (targetUserID: string, take = 4, allPhotos = true) => {
  const loggedInUserToken = useCometaStore(state => state.accessToken);
  return (
    useInfiniteQuery({
      initialPageParam: -1,
      queryKey: [QueryKeys.GET_SAME_MATCHED_EVENTS_BY_TWO_USERS_WITH_PAGINATION, targetUserID],
      queryFn: async ({ pageParam }): Promise<GetLikedEventsForBucketListWithPagination> => {
        const res = await eventService.getSameMatchedEventsByTwoUsersWithPagination(targetUserID, pageParam, take, loggedInUserToken, allPhotos);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to request data');
        }
      },
      getNextPageParam: (lastPage) => {
        // stops incrementing next page because there no more events left
        if (lastPage.hasNextCursor) {
          return lastPage.nextCursor;
        }
        return null; // makes hasNextPage evalutes to false
      },
      retry: 2,
      retryDelay: 1_000 * 6
    })
  );
};
