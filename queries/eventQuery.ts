/* eslint-disable no-unused-vars */
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCometaStore } from '../store/cometaStore';
import eventService from '../services/eventService';
import { EventsListRes, LikeEvent } from '../models/Event';


export const useInfiniteEventsQuery = () => {
  const accessToken = useCometaStore(state => state.accessToken);

  return (
    useInfiniteQuery({
      queryKey: ['events'],
      initialPageParam: 1,
      queryFn: async ({ pageParam }): Promise<EventsListRes> => {
        const res = await eventService.getAll(pageParam, 4, accessToken);
        if (res.status == 200) {
          return res.data;
        }
        else {
          throw new Error('failed to request data');
        }
      },
      // refetchInterval: 1_000 * 60 * 10,
      getNextPageParam: (lastPage) => {
        // stops incrementing next page because there no more events left
        if (lastPage.events.length == 0) {
          return null; // makes hasNextPage evalutes to false
        }
        return lastPage.currentPage + 1;
      },
      retry: 3,
      retryDelay: 3_000
    }));
};


export const useLikeEventMutation = () => {
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
      retry: 3,
      retryDelay: 3_000
    })
  );
};
