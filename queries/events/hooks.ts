/* eslint-disable no-unused-vars */
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  InfiniteData
}
  from '@tanstack/react-query';
import { useCometaStore } from '../../store/cometaStore';
import eventService from '../../services/eventService';
import { Event, EventsListRes, LikeEvent } from '../../models/Event';
import { LikedEventsListRes } from '../../models/LikedEvents';
import { UsersWhoLikedSameEventHttpRes } from '../../models/User';


// Define query keys as enums for better organization
enum QueryKeys {
  GET_EVENTS,
  GET_LIKED_EVENTS,
  GET_EVENT_BY_ID,
  GET_USERS_LIKED_SAME_EVENT
}


// Query to fetch a list of events with infinite scrolling
export const useInfiniteEventsQuery = () => {
  const accessToken = useCometaStore(state => state.accessToken);

  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.GET_EVENTS],
      initialPageParam: -1,
      queryFn: async ({ pageParam }): Promise<EventsListRes> => {
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
        if (lastPage.cursor == 0) {
          return null; // makes hasNextPage evalutes to false
        }
        return lastPage.cursor;
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    }));
};


// Query to fetch liked events with infinite scrolling
export const useInfiniteLikedEventsQuery = () => {
  const accessToken = useCometaStore(state => state.accessToken);

  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.GET_LIKED_EVENTS],
      initialPageParam: 1,
      queryFn: async ({ pageParam }): Promise<LikedEventsListRes> => {
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
export const useEventByIdQuery = (eventID: number) => {
  const accessToken = useCometaStore(state => state.accessToken);

  return useQuery({
    queryKey: [QueryKeys.GET_EVENT_BY_ID],
    queryFn: async (e): Promise<Event> => {
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
export const useInfiteUsersWhoLikedSameEventQuery = (eventID: number) => {
  const accessToken = useCometaStore(state => state.accessToken);

  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.GET_USERS_LIKED_SAME_EVENT],
      initialPageParam: 1,
      queryFn: async ({ pageParam }): Promise<UsersWhoLikedSameEventHttpRes> => {
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
        if (lastPage.usersWhoLikedSameEvent.length == 0) {
          return null; // makes hasNextPage evalutes to false
        }
        return lastPage.currentPage + 1;
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};


// Mutation to like or dislike an event
export const useLikeOrDislikeEventMutation = () => {
  const accessToken = useCometaStore(state => state.accessToken);
  const queryClient = useQueryClient();

  return (
    useMutation({
      mutationFn: async (eventID: number): Promise<LikeEvent | null> => {
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
        queryClient.setQueryData<InfiniteData<EventsListRes, number>>(['events'], (data) => ({
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
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_EVENTS] }),
          // failing to update immediatly
          queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_LIKED_EVENTS] })
        ]);
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};
