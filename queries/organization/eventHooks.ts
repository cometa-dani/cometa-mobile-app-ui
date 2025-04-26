import { useCometaStore } from '@/store/cometaStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { QueryKeys } from '../queryKeys';
import eventService from '@/services/company/eventService';
import { ICreateEvent, IEvent } from '@/models/Event';


export const useMutateCreateEvent = () => {
  return useMutation({
    mutationFn: (payload: ICreateEvent) => eventService.create(payload),
  });
};


export const useQueryGetEventsPaginated = () => {
  const isAuthenticated = useCometaStore(state => state.isAuthenticated);
  return (
    useQuery({
      enabled: isAuthenticated,
      queryKey: [QueryKeys.GET_ORGANIZATION_EVENTS],
      queryFn: async (): Promise<IEvent[]> => {
        const res = await eventService.getAllEvents();
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to fetched');
        }
      }
    })
  );
};
