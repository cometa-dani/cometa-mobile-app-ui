import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import friendshipService from '../services/friendshipService';
import { GetLatestFriendships } from '../models/Friendship';
import { useCometaStore } from '../store/cometaStore';
import { QueryKeys } from './queryKeys';


export const useInfiniteQueryGetNewestFriends = () => {
  const accessToken = useCometaStore(state => state.accessToken);

  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.GET_NEWEST_FRIENDS],
      initialPageParam: -1,
      queryFn: async ({ pageParam }): Promise<GetLatestFriendships> => {
        const res = await friendshipService.getAllLatest(pageParam, 4, accessToken);
        if (res.status == 200) {
          return res.data;
        }
        else {
          throw new Error('failed to fetch');
        }
      },
      // Define when to stop refetching
      getNextPageParam: (lastPage) => {
        // stops incrementing next page because there no more events left
        if (!lastPage.nextCursor) {
          return null; // makes hasNextPage evalutes to false
        }
        return lastPage.nextCursor;
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};


export const useMutationSentFriendshipInvitation = () => {
  const accessToken = useCometaStore(state => state.accessToken);
  const queryClient = useQueryClient();

  return (
    useMutation({
      mutationFn: async (newFriendId: number) => {
        const res =
          await friendshipService.sentFriendShipInvitation(newFriendId, accessToken);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed fech');
        }
      },
      onMutate: async () => { },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USERS_LIKED_SAME_EVENT] });
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};


export const useMutationAcceptFriendshipInvitation = () => {
  const accessToken = useCometaStore(state => state.accessToken);
  const queryClient = useQueryClient();

  return (
    useMutation({
      mutationFn: async (newFriendId: number) => {
        const res =
          await friendshipService.acceptFriendShipInvitation(newFriendId, accessToken);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed fech');
        }
      },
      onMutate: async () => { },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USERS_LIKED_SAME_EVENT] });
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};
