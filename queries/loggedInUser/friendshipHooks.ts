import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import friendshipService from '../../services/friendshipService';
import { GetLatestFriendships } from '../../models/Friendship';
import { useCometaStore } from '../../store/cometaStore';
import { QueryKeys } from '../queryKeys';


export const useInfiniteQueryGetLoggedInUserNewestFriends = () => {
  const loggedInUserAccessToken = useCometaStore(state => state.accessToken);

  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.GET_NEWEST_FRIENDS_WITH_PAGINATION],
      initialPageParam: -1,
      queryFn: async ({ pageParam }): Promise<GetLatestFriendships> => {
        const res = await friendshipService.getAllLatest(pageParam, 5, loggedInUserAccessToken);
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
        if (!lastPage.nextCursor || lastPage.friendships.length < 5) {
          return null; // makes hasNextPage evalutes to false
        }
        return lastPage.nextCursor;
      },
      retry: 2,
      retryDelay: 1_000 * 6,
    })
  );
};


export const useInfiniteQuerySearchFriendsByUserName = (friendUserName: string) => {
  const loggedInUserAccessToken = useCometaStore(state => state.accessToken);

  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.SEARCH_FRIENDS_BY_USERNAME, friendUserName],
      enabled: !!friendUserName,
      initialPageParam: -1,
      queryFn: async ({ pageParam }) => {
        const res = await friendshipService.searchFriendsByName(friendUserName, pageParam, 10, loggedInUserAccessToken);
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
        if (!lastPage.nextCursor || lastPage.friendships.length < 10) {
          return null; // makes hasNextPage evalutes to false
        }
        return lastPage.nextCursor;
      },
      retry: 2,
      retryDelay: 1_000 * 6,
    })
  );
};


export const useQueryGetFriendshipByTargetUserID = (targetUserUUID: string) => {
  const loggedInUserAccessToken = useCometaStore(state => state.accessToken);

  return (
    useQuery({
      queryKey: [QueryKeys.GET_FRIENDSHIP_BY_TARGET_USER_ID, targetUserUUID],
      queryFn: async () => {
        const res = await friendshipService.getFriendShipByTargetUserID(targetUserUUID, loggedInUserAccessToken);
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
  receiverID: number;
  // eventID: number
};

export const useMutationSentFriendshipInvitation = () => {
  const loggedInUserAccessToken = useCometaStore(state => state.accessToken);
  const queryClient = useQueryClient();

  return (
    useMutation({
      mutationFn: async ({ receiverID }: FriendshipInvitationArgs) => {
        const res =
          await friendshipService.sentFriendShipInvitation(receiverID, loggedInUserAccessToken);
        if (res.status === 201) {
          return res.data;
        }
        else {
          throw new Error('failed fech');
        }
      },
      onMutate: async ({ receiverID }) => {

        // ********************************
        // MAYBE TODO: optimistic update
        // ********************************

        // const prevState =
        // queryClient
        //   .setQueryData<InfiniteData<GetMatchedUsersWhoLikedEventWithPagination>>(
        //     [QueryKeys.GET_All_USERS_WHO_LIKED_SAME_EVENT_BY_ID_WITH_PAGINATION, eventID],
        //     (olData) => {
        //       return {
        //         pages: olData?.pages.flatMap(page => (
        //           {
        //             ...page,
        //             usersWhoLikedEvent: page.usersWhoLikedEvent.map(event => {
        //               if (event.userId !== receiverID) {
        //                 return event;
        //               }
        //               return {
        //                 ...event,
        //                 user: {
        //                   ...event.user,
        //                   outgoingFriendships: [
        //                     {
        //                       ...event.user?.outgoingFriendships[0],
        //                       id: 0,
        //                       status: 'PENDING',
        //                     }
        //                   ]
        //                 }
        //               };
        //             })
        //           }
        //         )) ?? [],
        //         pageParams: olData?.pageParams ?? []
        //       };
        //     }
        //   );
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_All_USERS_WHO_LIKED_SAME_EVENT_BY_ID_WITH_PAGINATION] });
      },
      retry: 2,
      retryDelay: 1_000 * 6,
    })
  );
};


export const useMutationCancelFriendshipInvitation = () => {
  const loggedInUserAccessToken = useCometaStore(state => state.accessToken);
  const queryClient = useQueryClient();

  return (
    useMutation({
      mutationFn: async (receiverID: number) => {
        const res =
          await friendshipService.cancelFriendShipInvitation(receiverID, loggedInUserAccessToken);
        if (res.status === 204) {
          return res.data ?? null;
        }
        else {
          throw new Error('failed fech');
        }
      },
      onMutate: async () => {
        // const prevState = queryClient.getQueryData<InfiniteData<GetMatchedUsersWhoLikedEventWithPagination>>([QueryKeys.GET_All_USERS_WHO_LIKED_SAME_EVENT_BY_ID_WITH_PAGINATION, receiverID]);
        // prevState?.pages.flatMap(page => page.usersWhoLikedEvent);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_All_USERS_WHO_LIKED_SAME_EVENT_BY_ID_WITH_PAGINATION] });
      },
      retry: 2,
      retryDelay: 1_000 * 6,
    })
  );
};


export const useMutationAcceptFriendshipInvitation = () => {
  const loggedInUserAccessToken = useCometaStore(state => state.accessToken);
  const queryClient = useQueryClient();

  return (
    useMutation({
      mutationFn: async (friendshipID: number) => {
        const res =
          await friendshipService.acceptFriendShipInvitation(friendshipID, loggedInUserAccessToken);
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
          queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_All_USERS_WHO_LIKED_SAME_EVENT_BY_ID_WITH_PAGINATION] })
        ]);
      },
      retry: 2,
      retryDelay: 1_000 * 6,
    })
  );
};
