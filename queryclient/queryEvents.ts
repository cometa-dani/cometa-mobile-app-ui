import { useInfiniteQuery } from '@tanstack/react-query';
import { useCometaStore } from '../store/cometaStore';
import eventService from '../services/eventService';
import { EventsListRes } from '../models/Event';


export const useInfiniteQueryEvents = () => {
  const accessToken = useCometaStore(state => state.accessToken);
  return (
    useInfiniteQuery({
      queryKey: ['events'],
      initialPageParam: 1,
      async queryFn({ pageParam }): Promise<EventsListRes> {
        const res = await eventService.getEvents(pageParam, 4, accessToken);
        if (res.status == 200) {
          return res.data;
        }
        else {
          throw new Error('failed to request data');
        }
      },
      getNextPageParam: (data) => {
        // // stops incrementing next page because there no more events left
        if (data.events.length == 0) {
          return data.currentPage;
        }
        return data.currentPage + 1;
      },
    }));
};
