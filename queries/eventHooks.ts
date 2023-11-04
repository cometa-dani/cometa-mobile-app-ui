/* eslint-disable no-unused-vars */
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
import { GetLatestEventsWithPagination, CreateEventLike } from '../models/Event';
import { GetAllLikedEventsWithPagination } from '../models/LikedEvents';
import { GetUsersWhoLikedEventWithPagination } from '../models/User';
import { GetLikedEventByID } from '../models/EventLike';


// Define query keys as enums for better organization
enum QueryKeys {
  GET_EVENTS,
  GET_LIKED_EVENTS,
  GET_EVENT_BY_ID,
  GET_USERS_LIKED_SAME_EVENT
}


// Query to fetch a list of events with infinite scrolling
export const useInfiniteQueryGetLatestEvents = () => {
  const accessToken = useCometaStore(state => state.accessToken);

  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.GET_EVENTS],
      initialPageParam: -1,
      queryFn: async ({ pageParam }): Promise<GetLatestEventsWithPagination> => {
        const res = await eventService.getAll(pageParam, 4, accessToken);
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
        const res = await eventService.getAllLikedEvents(pageParam, 5, accessToken);
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
    queryKey: [QueryKeys.GET_EVENT_BY_ID],
    queryFn: async (e): Promise<GetLikedEventByID> => {
      const res = await eventService.getLikedEventByID(eventID, accessToken);
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
export const useInfiteQueryGetUsersWhoLikedEventByID = (eventID: number) => {
  const accessToken = useCometaStore(state => state.accessToken);

  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.GET_USERS_LIKED_SAME_EVENT],
      initialPageParam: -1,
      queryFn: async ({ pageParam }): Promise<GetUsersWhoLikedEventWithPagination> => {
        const res = await eventService.getUsersWhoLikedSameEvent(eventID, pageParam, 5, accessToken);
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
          .setQueryData<InfiniteData<GetLatestEventsWithPagination, number>>
          ([QueryKeys.GET_EVENTS], (data) => ({
            pages: data?.pages.map(
              (page) => (
                {
                  ...page,
                  events: page.events.map(event => (
                    {
                      ...event,
                      isLiked: (
                        event.isLiked && (eventID === event.id) ? false
                          :
                          !event.isLiked && (eventID === event.id) ? true
                            :
                            event.isLiked
                      )
                    }
                  ))
                }
              )) || [],
            pageParams: data?.pageParams || []
          }));
      },
      // Invalidate queries after the mutation succeeds
      onSuccess: async () => {
        // await Promise.all([
        //   queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_EVENTS] }),
        //   // failing to update immediatly
        //   queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_LIKED_EVENTS] })
        // ]);
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};
