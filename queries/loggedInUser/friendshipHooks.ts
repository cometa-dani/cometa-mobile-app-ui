import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import friendshipService from '../../services/friendshipService';
import { GetLatestFriendships, MutateFrienship } from '../../models/Friendship';
import { QueryKeys } from '../queryKeys';
import { TypedAxiosError } from '../errors/typedError';


export const useInfiniteQueryGetLoggedInUserNewestFriends = () => {
  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.GET_NEWEST_FRIENDS_WITH_PAGINATION],
      initialPageParam: -1,
      queryFn: async ({ pageParam }): Promise<GetLatestFriendships> => {
        const res = await friendshipService.getAllLatest(pageParam, 5);
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
        if (lastPage.hasNextCursor) {
          return lastPage.nextCursor;
        }
        return null; // makes hasNextPage evalutes to false
      },
      retry: 2,
      retryDelay: 1_000 * 6,
    })
  );
};


export const useInfiniteQuerySearchFriendsByUserName = (friendUserName: string) => {
  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.SEARCH_FRIENDS_BY_USERNAME, friendUserName],
      enabled: !!friendUserName,
      initialPageParam: -1,
      queryFn: async ({ pageParam }) => {
        const res = await friendshipService.searchFriendsByName(friendUserName, pageParam, 10);
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
        if (lastPage.hasNextCursor) {
          return lastPage.nextCursor;
        }
        return null; // makes hasNextPage evalutes to false
      },
      retry: 2,
      retryDelay: 1_000 * 6,
    })
  );
};


export const useQueryGetFriendshipByTargetUserID = (targetUserUUID: string) => {
  return (
    useQuery({
      enabled: !!targetUserUUID,
      queryKey: [QueryKeys.GET_FRIENDSHIP_BY_TARGET_USER_ID, targetUserUUID],
      queryFn: async () => {
        const res = await friendshipService.getFriendShipByTargetUserID(targetUserUUID);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to fetch');
        }
      },
      retry: 2,
      retryDelay: 1_000 * 6,
    })
  );
};


type FriendshipInvitationArgs = {
  targetUserId: number;
};

export const useMutationSentFriendshipInvitation = () => {
  return (
    useMutation<MutateFrienship, TypedAxiosError, FriendshipInvitationArgs>({
      mutationFn: async ({ targetUserId }: FriendshipInvitationArgs) => {
        const res = await friendshipService.sentFriendShipInvitation(targetUserId);
        if (res.status === 201 || res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed fech');
        }
      }
    })
  );
};


export const useMutationDeleteFriendshipInvitation = () => {
  return (
    useMutation({
      mutationFn: async (targetUserID: number) => {
        const res =
          await friendshipService.deleteFriendShipInvitation(targetUserID);
        if (res.status === 204) {
          return res.data ?? null;
        }
        else {
          throw new Error('failed fech');
        }
      }
    })
  );
};


export const useMutationAcceptFriendshipInvitation = () => {
  return (
    useMutation<MutateFrienship, TypedAxiosError, number>({
      mutationFn: async (targetUserID: number) => {
        const res =
          await friendshipService.updateFrienshipInvitation(targetUserID, 'ACCEPTED');
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed fech');
        }
      }
    })
  );
};


export const useMutationResetFrienshipInvitation = () => {
  const queryClient = useQueryClient();
  return (
    useMutation<MutateFrienship, TypedAxiosError, number>({
      mutationFn: async (targetUserID: number) => {
        const res =
          await friendshipService.updateFrienshipInvitation(targetUserID, 'PENDING');
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed fech');
        }
      },
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_NEWEST_FRIENDS_WITH_PAGINATION] }),
          queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT_WITH_PAGINATION] })
        ]);
      }
    })
  );
};
