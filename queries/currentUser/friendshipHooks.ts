import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import friendshipService from '../../services/friendshipService';
import { Friendship, MutateFrienship } from '../../models/Friendship';
import { QueryKeys } from '../queryKeys';
import { TypedAxiosError } from '../errors/typedError';
import { IPaginated } from '@/models/utils/Paginated';
import { IGetPaginatedUsersWhoLikedSameEvent } from '@/models/User';
import { useCometaStore } from '@/store/cometaStore';
import { ErrorMessage } from '../errors/errorMessages';


export const useInfiniteQueryGetNewestFriends = () => {
  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.GET_NEWEST_FRIENDS],
      initialPageParam: -1,
      queryFn: async ({ pageParam }): Promise<IPaginated<Friendship>> => {
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
      }
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
      }
    })
  );
};


export const useMutationSentFriendshipInvitation = () => {
  const queryClient = useQueryClient();
  const selectedLikedEvent = useCometaStore(state => state.likedEvent);
  const acceptInvitation = useMutationAcceptFriendshipInvitation();
  return (
    useMutation<MutateFrienship, TypedAxiosError, number>({
      mutationFn: async (targetUserId: number) => {
        const res = await friendshipService.sentFriendShipInvitation(targetUserId);
        if (res.status === 201) {
          return res.data;
        }
        else {
          throw new Error('failed fech');
        }
      },
      onMutate: (targetUserId) => {
        queryClient.setQueryData<InfiniteData<IGetPaginatedUsersWhoLikedSameEvent>>(
          [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT, selectedLikedEvent?.id],
          (oldData) => ({
            pageParams: oldData?.pageParams,
            pages:
              oldData?.pages
                .map((page) => ({
                  ...page,
                  items:
                    page.items
                      .map(event => event.userId === targetUserId ?
                        ({
                          ...event,
                          user: {
                            ...event.user,
                            hasOutgoingFriendshipInvitation: true
                            // hasIncommingFriendshipInvitation: true
                          }
                        })
                        : event
                      )
                }))
          }) as InfiniteData<IGetPaginatedUsersWhoLikedSameEvent>);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT, selectedLikedEvent?.id]
        });
      },
      onError: ({ response }, targetUserId) => {
        if (response?.data.message === ErrorMessage.INVITATION_ALREADY_PENDING) {
          // acceptPendingInvitation(targetUserAsReceiver);
          acceptInvitation.mutate(targetUserId);
        }
      }
    })
  );
};


export const useMutationAcceptFriendshipInvitation = () => {
  const queryClient = useQueryClient();
  const selectedLikedEvent = useCometaStore(state => state.likedEvent);
  const sentFriendship = useMutationSentFriendshipInvitation();
  return (
    useMutation<MutateFrienship, TypedAxiosError, number>({
      mutationFn: async (targetUserID: number) => {
        const res =
          await friendshipService.updateFrienshipInvitationByID(targetUserID, 'ACCEPTED');
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed fech');
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_NEWEST_FRIENDS] });
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT, selectedLikedEvent?.id ?? ''] });
      },
      onError: ({ response }, targetUserId) => {
        if (response?.data.message === ErrorMessage.INVITATION_DOES_NOT_EXIST) {
          sentFriendship.mutate(targetUserId);
        }
      },
      onMutate: (targetUserId) => {
        queryClient.setQueryData<InfiniteData<IGetPaginatedUsersWhoLikedSameEvent>>(
          [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT, selectedLikedEvent?.id],
          (oldData) => ({
            pageParams: oldData?.pageParams,
            pages: oldData?.pages
          }) as InfiniteData<IGetPaginatedUsersWhoLikedSameEvent>);
      }
    })
  );
};


export const useMutationDeleteFriendshipInvitation = () => {
  return (
    useMutation({
      mutationFn: async (targetUserID: number) => {
        const res =
          await friendshipService.deleteFriendShipInvitationByQueryParams(targetUserID);
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


export const useMutationResetFrienshipInvitation = () => {
  const queryClient = useQueryClient();
  return (
    useMutation<MutateFrienship, TypedAxiosError, number>({
      mutationFn: async (targetUserID: number) => {
        const res =
          await friendshipService.updateFrienshipInvitationByID(targetUserID, 'PENDING');
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed fech');
        }
      },
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_NEWEST_FRIENDS] }),
          queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT] })
        ]);
      }
    })
  );
};
