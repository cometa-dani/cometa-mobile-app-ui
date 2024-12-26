import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { QueryKeys } from '../queryKeys';
import { IGetTargetUser, IUsersWhoLikedSameEvent } from '../../models/User';
import userService from '../../services/userService';
import { IPaginated } from '@/models/utils/Paginated';


export const useQueryGetTargetUserPeopleProfileByUid = (dynamicParam: string) => {
  return (
    useQuery({
      enabled: !!dynamicParam,
      queryKey: [QueryKeys.GET_TARGET_USER_INFO_PROFILE, dynamicParam],
      queryFn: async (): Promise<IGetTargetUser> => {
        const res = await userService.getTargetUserProfile(dynamicParam);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to fetched');
        }
      },
      retry: 2,
      retryDelay: 1_000 * 6
    })
  );
};


// Query to fetch users who liked the same event with infinite scrolling
export const useInfiteQueryGetUsersWhoLikedSameEvent = (eventId: number) => {
  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.GET_PAGINATED_USERS_WHO_LIKED_SAME_EVENT, eventId],
      initialPageParam: -1,
      enabled: !!eventId,
      queryFn: async ({ pageParam }): Promise<IPaginated<IUsersWhoLikedSameEvent>> => {
        const res = await userService.getUserWhoLikedSameEventById(eventId, pageParam, 8);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to request data');
        }
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.hasNextCursor) {
          return lastPage.nextCursor;
        }
        return null;
      },
      refetchInterval: 1_000 * 60 * 10  // 15 minutes
    })
  );
};
