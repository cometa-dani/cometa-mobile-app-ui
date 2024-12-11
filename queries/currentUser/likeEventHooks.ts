import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateEventLike, IGetLatestPaginatedEvents } from '../../models/Event';
import eventService from '../../services/eventService';
import { QueryKeys } from '../queryKeys';
import { IGetPaginatedLikedEventsBucketList } from '../../models/LikedEvent';


type MutateEventLikeArgs = { eventID: number, targetUserId?: number };


// Mutation to like or dislike an event
export const useMutationLikeOrDislikeEvent = () => {
  return (
    useMutation({
      mutationFn: async ({ eventID }: MutateEventLikeArgs): Promise<CreateEventLike | null> => {
        const res = await eventService.createOrDeleteLikeByEventID(eventID);
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
      retry: 2,
      retryDelay: 1_000 * 6
    })
  );
};


export const useMutationDeleteLikedEventFromBucketList = () => {
  const queryClient = useQueryClient();
  return (
    useMutation({
      mutationFn: async (eventID: number): Promise<CreateEventLike | null> => {
        const res = await eventService.createOrDeleteLikeByEventID(eventID);
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
          .setQueryData<InfiniteData<IGetPaginatedLikedEventsBucketList, number>>
          ([QueryKeys.GET_PAGINATED_LIKED_EVENTS_FOR_BUCKETLIST], (oldData) => ({
            pages: oldData?.pages.map(
              (page) => (
                {
                  ...page,
                  items: page.items.filter(event => eventID !== event.id)
                }
              )) || [],
            pageParams: oldData?.pageParams || []
          }));

        return eventID;
      },
      // Invalidate queries after the mutation succeeds
      onSuccess: async (_, eventID) => {
        queryClient
          .setQueryData<InfiniteData<IGetLatestPaginatedEvents, number>>
          ([QueryKeys.SEARCH_PAGINATED_EVENTS], (oldData) => ({
            pages: oldData?.pages.map(
              (page) => (
                {
                  ...page,
                  items: page.items.map(event =>
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
      retry: 2,
      retryDelay: 1_000 * 6
    })
  );
};
