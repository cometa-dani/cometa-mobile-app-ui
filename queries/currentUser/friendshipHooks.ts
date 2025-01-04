import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import friendshipService from '../../services/friendshipService';
import { Friendship, IGetLatestFriendships, MutateFrienship } from '../../models/Friendship';
import { QueryKeys } from '../queryKeys';
import { TypedAxiosError } from '../errors/typedError';
import { IPaginated } from '@/models/utils/Paginated';
import { IGetPaginatedUsersWhoLikedSameEvent, IGetTargetUser } from '@/models/User';
import { useCometaStore } from '@/store/cometaStore';
import { Notifier } from 'react-native-notifier';
import { ErrorToast } from '@/components/toastNotification/toastNotification';


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
  const targetUser = useCometaStore(state => state.targetUser);
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
          (oldData) => {
            if (!oldData) return;
            return {
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
                              hasIncommingFriendshipInvitation: true,
                            }
                          })
                          : event
                        )
                  }))
            };
          }
        );
        queryClient.setQueriesData<IGetTargetUser>({
          queryKey: [QueryKeys.GET_TARGET_USER_PROFILE, targetUser?.uid]
        },
          (oldData) => {
            if (!oldData) return;
            return {
              ...oldData,
              hasIncommingFriendshipInvitation: true
            };
          });
      }
    })
  );
};


export const useMutationAcceptFriendshipInvitation = () => {
  const queryClient = useQueryClient();
  const selectedLikedEvent = useCometaStore(state => state.likedEvent);
  const targetUser = useCometaStore(state => state.targetUser);
  return (
    useMutation<MutateFrienship, TypedAxiosError, number>({
      mutationFn: async (targetUserID: number) => {
        const res =
          await friendshipService.updateFriendshipByQueryParams(targetUserID, 'ACCEPTED');
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed fech');
        }
      },
      onMutate: (targetUserID) => {
        queryClient.setQueryData<InfiniteData<IGetPaginatedUsersWhoLikedSameEvent>>(
          [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT, selectedLikedEvent?.id],
          (oldData) => {
            if (!oldData) return;
            return {
              pageParams: oldData?.pageParams,
              pages: (
                oldData?.pages
                  .map((page) => ({
                    ...page,
                    items: page.items.filter(({ user }) => user.id !== targetUserID)
                  }))
              )
            };
          });
        queryClient.setQueriesData<IGetTargetUser>({
          queryKey: [QueryKeys.GET_TARGET_USER_PROFILE, targetUser?.uid]
        },
          (oldData) => {
            if (!oldData) return;
            return {
              ...oldData,
              isFriend: true,
            };
          });
      },
      onSuccess: async () => {
        try {
          await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_NEWEST_FRIENDS] });
        }
        catch (error) {
          return null;
        }
      },
    })
  );
};


export const useMutationDeleteFriendshipInvitation = () => {
  const queryClient = useQueryClient();
  const targetUser = useCometaStore(state => state.targetUser);
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
      },
      onMutate: (targetUserID) => {
        queryClient.setQueriesData<IGetTargetUser>({
          queryKey: [QueryKeys.GET_TARGET_USER_PROFILE, targetUser?.uid]
        },
          (oldData) => {
            if (!oldData) return;
            return {
              ...oldData,
              isFriend: false,
            };
          });
        queryClient.setQueryData<InfiniteData<IGetLatestFriendships>>(
          [QueryKeys.GET_NEWEST_FRIENDS],
          (oldData) => {
            if (!oldData) return;
            return {
              ...oldData,
              pages:
                oldData?.pages
                  .map((page) => ({
                    ...page,
                    items: page.items.filter(({ friend }) => friend.id !== targetUserID)
                  }))
            };
          });
      },
      onError: () => {
        Notifier.showNotification({
          title: 'Error',
          description: 'something went wrong, try again',
          Component: ErrorToast,
        });
        queryClient.setQueriesData<IGetTargetUser>({
          queryKey: [QueryKeys.GET_TARGET_USER_PROFILE, targetUser?.uid]
        },
          (oldData) => {
            if (!oldData) return;
            return {
              ...oldData,
              isFriend: true,
            };
          });
      }
    })
  );
};


// export const useMutationResetFrienshipInvitation = () => {
//   const queryClient = useQueryClient();
//   return (
//     useMutation<MutateFrienship, TypedAxiosError, number>({
//       mutationFn: async (targetUserID: number) => {
//         const res =
//           await friendshipService.updateFrienshipInvitationByID(targetUserID, 'PENDING');
//         if (res.status === 200) {
//           return res.data;
//         }
//         else {
//           throw new Error('failed fech');
//         }
//       },
//       onSuccess: async () => {
//         await Promise.all([
//           queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_NEWEST_FRIENDS] }),
//           queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT] })
//         ]);
//       }
//     })
//   );
// };
