import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  InfiniteData
}
  from '@tanstack/react-query';
import { useCometaStore } from '../store/cometaStore';
import eventService from '../services/eventService';
import { GetAllLatestEventsWithPagination, CreateEventLike } from '../models/Event';
import { GetLikedEventsForBucketListWithPagination } from '../models/LikedEvent';
import { GetMatchedUsersWhoLikedEventWithPagination } from '../models/User';
import { GetEventByID } from '../models/EventLike';
import { QueryKeys } from './queryKeys';


// Query to fetch a list of events with infinite scrolling
export const useInfiniteQueryGetLatestEvents = () => {
  const accessToken = useCometaStore(state => state.accessToken);

  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.GET_LATEST_EVENTS_WITH_PAGINATION],
      initialPageParam: -1,
      queryFn: async ({ pageParam }): Promise<GetAllLatestEventsWithPagination> => {
        const res = await eventService.getAllEventsWithPagination(pageParam, 4, accessToken);
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
        if (!lastPage.nextCursor || lastPage.events.length < 4) {
          return null; // makes hasNextPage evalutes to false
        }
        return lastPage.nextCursor;
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    }));
};


export const useInfiniteQueryGetLikedEventsForBucketList = () => {
  const accessToken = useCometaStore(state => state.accessToken);

  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST_WITH_PAGINATION],
      initialPageParam: -1,
      queryFn: async ({ pageParam }): Promise<GetLikedEventsForBucketListWithPagination> => {
        const res = await eventService.getLikedEventsForBucketListWithPagination(pageParam, 8, accessToken);
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
        if (!lastPage.nextCursor || lastPage.events.length < 8) {
          return null; // makes hasNextPage evalutes to false
        }
        return lastPage.nextCursor;
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};


export const useInfiniteQueryGetLikedEventsByUserId = (anotherUserId?: number) => {
  return (
    useInfiniteQuery({
      enabled: !!anotherUserId,
      queryKey: [QueryKeys.GET_LIKED_EVENTS_BY_USER_ID_WITH_PAGINATION, anotherUserId],
      initialPageParam: -1,
      queryFn: async ({ pageParam }): Promise<GetLikedEventsForBucketListWithPagination> => {
        const res = await eventService.getLikedEventsForBucketListWithPagination(pageParam, 4, undefined, true, anotherUserId);
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
        if (!lastPage.nextCursor || lastPage.events.length < 4) {
          return null; // makes hasNextPage evalutes to false
        }
        return lastPage.nextCursor;
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};

// TODO can be removed beacuse it's not used and I am reading the cahed date from the queryClient
export const useQueryGetEventInfoById = (eventID: number) => {
  const accessToken = useCometaStore(state => state.accessToken);

  return useQuery({
    enabled: !!eventID,
    queryKey: [QueryKeys.GET_EVENT_INFO_BY_ID],
    queryFn: async (): Promise<GetEventByID> => {
      const res = await eventService.getEventByID(eventID, accessToken);
      if (res.status === 200) {
        return res.data;
      }
      else {
        throw new Error('failed to request data');
      }
    },
    retry: 3,
    retryDelay: 3_000
  });
};


// Query to fetch users who liked the same event with infinite scrolling
export const useInfiteQueryGetUsersWhoLikedSameEventByID = (eventID: number) => {
  const accessToken = useCometaStore(state => state.accessToken);

  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT_BY_ID_WITH_PAGINATION],
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
        if (!lastPage.nextCursor || lastPage.usersWhoLikedEvent.length < 5) {
          return null; // makes hasNextPage evalutes to false
        }
        return lastPage.nextCursor;
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};


export const useInfiniteQueryGetMatchedEventsBySameUsers = (user2Token: string, take = 4, allPhotos = true) => {
  const user1Token = useCometaStore(state => state.accessToken);

  return (
    useInfiniteQuery({
      initialPageParam: -1,
      queryKey: [QueryKeys.GET_MATCHED_EVENTS_BY_SAME_USERS_WITH_PAGINATION, user2Token],
      queryFn: async ({ pageParam }): Promise<GetLikedEventsForBucketListWithPagination> => {
        const res = await eventService.getMatchedEventsByTwoUsersWithPagination(user2Token, pageParam, take, user1Token, allPhotos);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to request data');
        }
      },
      getNextPageParam: (lastPage) => {
        // stops incrementing next page because there no more events left
        if (!lastPage.nextCursor || lastPage.events.length < take) {
          return null; // makes hasNextPage evalutes to false
        }
        return lastPage.nextCursor;
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};


// export const useQueryGetMatchedEventsBySameUsers = (user2Token: string, take = 5,) => {
//   const user1Token = useCometaStore(state => state.accessToken);

//   return (
//     useQuery({
//       queryKey: [QueryKeys.GET_MATCHED_EVENTS_BY_SAME_USERS_WITH_PAGINATION],
//       queryFn: async (): Promise<MatchedEvents[]> => {
//         const res = await eventService.getMatchedEventsByTwoUsers(user2Token, take, user1Token);
//         if (res.status === 200) {
//           return res.data;
//         }
//         else {
//           throw new Error('failed to request data');
//         }
//       },
//       retry: 3,
//       retryDelay: 1_000 * 60 * 3
//     })
//   );
// };

// Mutation to like or dislike an event
export const useMutationLikeOrDislikeEvent = () => {
  const accessToken = useCometaStore(state => state.accessToken);
  const queryClient = useQueryClient();

  return (
    useMutation({
      mutationFn: async (eventID: number): Promise<CreateEventLike | null> => {
        const res = await eventService.createOrDeleteLikeByEventID(eventID, accessToken);
        if (res.status === 201) {
          return res.data?.eventLikedOrDisliked;
        }
        else if (res.status === 204) {
          return null;
        }
        else {
          throw new Error('failed to request data');
        }
      },
      onMutate: (eventID) => {
        // Update the cache with the new liked state
        queryClient
          .setQueryData<InfiniteData<GetAllLatestEventsWithPagination, number>>
          ([QueryKeys.GET_LATEST_EVENTS_WITH_PAGINATION], (data) => ({
            pages: data?.pages.map(
              (page) => (
                {
                  ...page,
                  events: page.events.map(event =>
                    eventID === event.id ? (
                      {
                        ...event,
                        isLiked: !event.isLiked,
                        _count: {
                          ...event._count,
                          likes: !event.isLiked ?
                            event._count.likes + 1
                            : event._count.likes - 1
                        }
                      }
                    ) :
                      event
                  )
                }
              )) || [],
            pageParams: data?.pageParams || []
          }));
      },
      // Invalidate queries after the mutation succeeds
      onSuccess: async () => {

        // TODO

        // What if on succes we dont invalidate the query?
        // and just update the cache ?

        // TODO

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_LATEST_EVENTS_WITH_PAGINATION] }),
          queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST_WITH_PAGINATION] })

          //  ADD
          // INVALIDATE QUERIES FOR MATCHED EVENTS
        ]);
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};


export const useMutationDeleteLikedEventFromBucketList = () => {
  const accessToken = useCometaStore(state => state.accessToken);
  const queryClient = useQueryClient();

  return (
    useMutation({
      mutationFn: async (eventID: number): Promise<CreateEventLike | null> => {
        const res = await eventService.createOrDeleteLikeByEventID(eventID, accessToken);
        if (res.status === 201) {
          return res.data?.eventLikedOrDisliked;
        }
        if (res.status === 204) {
          return null;
        }
        else {
          throw new Error('failed to request data');
        }
      },
      onMutate: (eventID) => {
        // Update the cache with the new liked state
        queryClient
          .setQueryData<InfiniteData<GetLikedEventsForBucketListWithPagination, number>>
          ([QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST_WITH_PAGINATION], (data) => ({
            pages: data?.pages.map(
              (page) => (
                {
                  ...page,
                  events: page.events.filter(event => eventID !== event.id)
                }
              )) || [],
            pageParams: data?.pageParams || []
          }));
      },
      // Invalidate queries after the mutation succeeds
      onSuccess: async () => {
        await Promise.all([
          // TOO SLOW
          queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_LATEST_EVENTS_WITH_PAGINATION] }),
        ]);
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};
