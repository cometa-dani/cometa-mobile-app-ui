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
import { GetAllLatestEventsWithPagination, CreateEventLike, MatchedEvents } from '../models/Event';
import { GetAllLikedEventsWithPagination } from '../models/LikedEvent';
import { GetUsersWhoLikedEventWithPagination } from '../models/User';
import { GetEventByID } from '../models/EventLike';
import { QueryKeys } from './queryKeys';


// Query to fetch a list of events with infinite scrolling
export const useInfiniteQueryGetLatestEvents = () => {
  const accessToken = useCometaStore(state => state.accessToken);

  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.GET_EVENTS],
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
        if (!lastPage.nextCursor) {
          return null; // makes hasNextPage evalutes to false
        }
        return lastPage.nextCursor;
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    }));
};


// TODO: change to cursor based pagination

// Query to fetch liked events with infinite scrolling
export const useInfiniteQueryGetLatestLikedEvents = () => {
  const accessToken = useCometaStore(state => state.accessToken);

  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.GET_LIKED_EVENTS],
      initialPageParam: 1,
      queryFn: async ({ pageParam }): Promise<GetAllLikedEventsWithPagination> => {
        const res = await eventService.getAllLikedEventsWithPagination(pageParam, 8, accessToken);
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
        if (lastPage.events.length == 0) {
          return null; // makes hasNextPage evalutes to false
        }
        return lastPage.currentPage + 1;
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};


// Query to fetch a single event by its ID
export const useQueryGetEventById = (eventID: number) => {
  const accessToken = useCometaStore(state => state.accessToken);

  return useQuery({
    enabled: !!eventID,
    queryKey: [QueryKeys.GET_EVENT_BY_ID],
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
      queryKey: [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT],
      initialPageParam: -1,
      enabled: !!eventID,
      queryFn: async ({ pageParam }): Promise<GetUsersWhoLikedEventWithPagination> => {
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


export const useQueryGetMatchedEvents = (user2: string, take = 5,) => {
  const user1Token = useCometaStore(state => state.accessToken);

  return (
    useQuery({
      queryKey: [QueryKeys.GET_MATCHED_EVENTS_BY_TWO_USERS],
      queryFn: async (): Promise<MatchedEvents[]> => {
        const res = await eventService.getMatchedEventsByTwoUsers(user2, take, user1Token);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to request data');
        }
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};

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
          ([QueryKeys.GET_EVENTS], (data) => ({
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
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_EVENTS] }),
          queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_LIKED_EVENTS] })
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
          .setQueryData<InfiniteData<GetAllLikedEventsWithPagination, number>>
          ([QueryKeys.GET_LIKED_EVENTS], (data) => ({
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
          queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_EVENTS] }),
          // queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_LIKED_EVENTS] }),
        ]);
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};
