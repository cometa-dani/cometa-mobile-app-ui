/* eslint-disable no-unused-vars */
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCometaStore } from '../store/cometaStore';
import eventService from '../services/eventService';
import { EventsListRes } from '../models/Event';


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
      getNextPageParam: (lastPage, Allpages, lastPageParam) => {
        // stops incrementing next page because there no more events left
        if (lastPage.events.length == 0) {
          return null; // makes hasNextPage evalutes to false
        }
        return lastPage.currentPage + 1;
      },
    }));
};
