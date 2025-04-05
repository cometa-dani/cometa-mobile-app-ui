import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { QueryKeys } from '../queryKeys';
import { IGetTargetUser, IUsersWhoLikedSameEvent } from '../../models/User';
import userService from '../../services/userService';
import { IPaginated } from '@/models/utils/Paginated';


export const useQueryGetTargetUserPeopleProfile = (userUuid: string) => {
  return (
    useQuery({
      enabled: !!userUuid,
      queryKey: [QueryKeys.GET_TARGET_USER_PROFILE, userUuid],
      queryFn: async (): Promise<IGetTargetUser> => {
        const res = await userService.getTargetUserProfile(userUuid);
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
      refetchOnWindowFocus: true,
      queryKey: [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT, eventId],
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
      refetchInterval: 1_000 * 60 * 8  // 8 minutes
    })
  );
};
