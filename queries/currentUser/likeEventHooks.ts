import { useMutation } from '@tanstack/react-query';
import { CreateEventLike } from '../../models/Event';
import eventService from '../../services/eventService';
import { MutationKeys } from '../mutationKeys';


type MutateEventLikeArgs = { eventID: number, targetUserId?: number };


// Mutation to like or dislike an event
export const useMutationLikeOrDislikeEvent = () => {
  return (
    useMutation({
      mutationKey: [MutationKeys.EVENT_LIKE],
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
