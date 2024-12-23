import { useMutation } from '@tanstack/react-query';
import { CreateEventLike } from '../../models/Event';
import eventService from '../../services/eventService';


type MutateEventLikeArgs = { eventID: number, targetUserId?: number };


// Mutation to like or dislike an event
export const useMutationLikeOrDislikeEvent = () => {
  // const queryClient = useQueryClient();
  // const queryCache = queryClient.getQueryCache();
  // console.log(queryCache.getAll());
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
      }
    })
  );
};
