import {
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
import { QueryKeys } from './queryKeys';


export const useInfiniteQueryGetLikedEventsForBucketListByTargerUser = (targetUserId?: number) => {
  const firstUserAccessToken = useCometaStore(state => state.accessToken);

  return (
    useInfiniteQuery({
      enabled: !!targetUserId,
      queryKey: [QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST_BY_TARGET_USER_ID_WITH_PAGINATION, targetUserId],
      initialPageParam: -1,
      queryFn: async ({ pageParam }): Promise<GetLikedEventsForBucketListWithPagination> => {
        const res = await eventService.getLikedEventsByUserIdWithPagination(pageParam, 4, firstUserAccessToken, targetUserId);
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


// Query to fetch a list of events with infinite scrolling
export const useInfiniteQueryGetLatestEventsByLoggedInUser = () => {
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


export const useInfiniteQueryGetLikedEventsForBucketListByLoggedInUser = () => {
  const loggedInUserAccessToken = useCometaStore(state => state.accessToken);

  return (
    useInfiniteQuery({
      queryKey: [QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST_BY_LOGGED_IN_USER_WITH_PAGINATION],
      initialPageParam: -1,
      queryFn: async ({ pageParam }): Promise<GetLikedEventsForBucketListWithPagination> => {
        const res = await eventService.getLikedEventsByUserIdWithPagination(pageParam, 8, loggedInUserAccessToken);
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


export const useInfiniteQueryGetSameMatchedEventsByTwoUsers = (targetUserToken: string, take = 4, allPhotos = true) => {
  const loggedInUserToken = useCometaStore(state => state.accessToken);

  return (
    useInfiniteQuery({
      initialPageParam: -1,
      queryKey: [QueryKeys.GET_SAME_MATCHED_EVENTS_BY_TWO_USERS_WITH_PAGINATION, targetUserToken],
      queryFn: async ({ pageParam }): Promise<GetLikedEventsForBucketListWithPagination> => {
        const res = await eventService.getSameMatchedEventsByTwoUsersWithPagination(targetUserToken, pageParam, take, loggedInUserToken, allPhotos);
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


type MutateEventLikeArgs = { eventID: number, targetUserId?: number };

// Mutation to like or dislike an event
export const useMutationLikeOrDislikeEvent = () => {
  const loggedInUserAccessToken = useCometaStore(state => state.accessToken);
  const queryClient = useQueryClient();

  return (
    useMutation({
      mutationFn: async ({ eventID }: MutateEventLikeArgs): Promise<CreateEventLike | null> => {
        const res = await eventService.createOrDeleteLikeByEventID(eventID, loggedInUserAccessToken);
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
      onMutate: ({ eventID, targetUserId }) => {
        // Update the cache with the new liked state
        if (!targetUserId) {
          queryClient
            .setQueryData<InfiniteData<GetAllLatestEventsWithPagination, number>>
            ([QueryKeys.GET_LATEST_EVENTS_WITH_PAGINATION], (oldData) => ({
              pages: oldData?.pages.map(
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
              pageParams: oldData?.pageParams || []
            }));
        }
        else {
          queryClient
            .setQueryData<InfiniteData<GetLikedEventsForBucketListWithPagination, number>>
            ([QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST_BY_TARGET_USER_ID_WITH_PAGINATION, targetUserId], (oldData) => ({
              pages: oldData?.pages.map(
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
              pageParams: oldData?.pageParams || []
            }));
        }
      },
      // Invalidate queries after the mutation succeeds
      onSuccess: async (_, { targetUserId }) => {
        if (!targetUserId) {
          await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST_BY_LOGGED_IN_USER_WITH_PAGINATION] });
        }
        else {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST_BY_LOGGED_IN_USER_WITH_PAGINATION] }),
            queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_LATEST_EVENTS_WITH_PAGINATION] })
          ]);
        }
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};


export const useMutationDeleteLikedEventFromBucketList = () => {
  const loggedInUserAccessToken = useCometaStore(state => state.accessToken);
  const queryClient = useQueryClient();

  return (
    useMutation({
      mutationFn: async (eventID: number): Promise<CreateEventLike | null> => {
        const res = await eventService.createOrDeleteLikeByEventID(eventID, loggedInUserAccessToken);
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
          ([QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST_BY_LOGGED_IN_USER_WITH_PAGINATION], (data) => ({
            pages: data?.pages.map(
              (page) => (
                {
                  ...page,
                  events: page.events.filter(event => eventID !== event.id)
                }
              )) || [],
            pageParams: data?.pageParams || []
          }));

        return eventID;
      },
      // Invalidate queries after the mutation succeeds
      onSuccess: async (_, eventID) => {
        queryClient
          .setQueryData<InfiniteData<GetAllLatestEventsWithPagination, number>>
          ([QueryKeys.GET_LATEST_EVENTS_WITH_PAGINATION], (oldData) => ({
            pages: oldData?.pages.map(
              (page) => (
                {
                  ...page,
                  events: page.events.map(event =>
                    eventID === event.id ? (
                      {
                        ...event,
                        isLiked: false,
                        _count: {
                          ...event._count,
                          likes: event._count.likes - 1
                        }
                      }
                    ) :
                      event
                  )
                }
              )) || [],

            pageParams: oldData?.pageParams || []
          }));
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};
