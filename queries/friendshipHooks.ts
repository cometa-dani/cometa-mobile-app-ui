import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import friendshipService from '../services/friendshipService';
import { GetLatestFriendships } from '../models/Friendship';
import { useCometaStore } from '../store/cometaStore';
import { QueryKeys } from './queryKeys';


export const useInfiniteQueryGetNewestFriends = () => {
  const accessToken = useCometaStore(state => state.accessToken);

  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.GET_NEWEST_FRIENDS_WITH_PAGINATION],
      initialPageParam: -1,
      queryFn: async ({ pageParam }): Promise<GetLatestFriendships> => {
        const res = await friendshipService.getAllLatest(pageParam, 5, accessToken);
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


export const useQueryGetFriendshipByReceiverAndSender = (receiverID: number) => {
  const accessToken = useCometaStore(state => state.accessToken);

  return (
    useQuery({
      queryKey: [QueryKeys.GET_FRIENDSHIP_BY_RECEIVER_ID_AND_SENDER_ID],
      queryFn: async () => {
        const res = await friendshipService.getFriendShipByReceiverID(receiverID, accessToken);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to fetch');
        }
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
      mutationFn: async (receiverID: number) => {
        const res =
          await friendshipService.sentFriendShipInvitation(receiverID, accessToken);
        if (res.status === 201) {
          return res.data;
        }
        else {
          throw new Error('failed fech');
        }
      },
      onMutate: async () => { },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT_BY_ID_WITH_PAGINATION] });
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};


export const useMutationCancelFriendshipInvitation = () => {
  const accessToken = useCometaStore(state => state.accessToken);
  const queryClient = useQueryClient();

  return (
    useMutation({
      mutationFn: async (receiverID: number) => {
        const res =
          await friendshipService.cancelFriendShipInvitation(receiverID, accessToken);
        if (res.status === 204) {
          return res.data ?? null;
        }
        else {
          throw new Error('failed fech');
        }
      },
      onMutate: async () => { },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT_BY_ID_WITH_PAGINATION] });
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
      mutationFn: async (friendshipID: number) => {
        const res =
          await friendshipService.acceptFriendShipInvitation(friendshipID, accessToken);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed fech');
        }
      },
      onMutate: async () => { },
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_NEWEST_FRIENDS_WITH_PAGINATION] }),
          queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT_BY_ID_WITH_PAGINATION] })
        ]);
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};
