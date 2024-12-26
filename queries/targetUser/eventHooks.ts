import { useInfiniteQuery } from '@tanstack/react-query';
import eventService from '../../services/eventService';
import { IGetPaginatedLikedEventsBucketList } from '../../models/LikedEvent';
import { IGetPaginatedUsersWhoLikedSameEvent } from '../../models/User';
import { QueryKeys } from '../queryKeys';
import userService from '@/services/userService';


export const useInfiniteQueryGetLikedEventsForBucketListByTargerUser = (targetUserId?: number) => {
  return (
    useInfiniteQuery({
      enabled: !!targetUserId,
      queryKey: [QueryKeys.GET_PAGINATED_LIKED_EVENTS_FOR_BUCKETLIST_BY_TARGET_USER_ID, targetUserId],
      initialPageParam: -1,
      queryFn: async ({ pageParam }): Promise<IGetPaginatedLikedEventsBucketList> => {
        const res = await eventService.getLikedEventsByUserIdWithPagination(pageParam, 4, targetUserId);
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


export const useInfiniteQueryGetSameMatchedEventsByTwoUsers = (targetUserID: string, take = 4, allPhotos = true) => {
  return (
    useInfiniteQuery({
      initialPageParam: -1,
      queryKey: [QueryKeys.GET_PAGINATED_MATCHED_EVENTS_BY_TWO_USERS, targetUserID],
      queryFn: async ({ pageParam }): Promise<IGetPaginatedLikedEventsBucketList> => {
        const res = await eventService.getSameMatchedEventsByTwoUsersWithPagination(targetUserID, pageParam, take, allPhotos);
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
