/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { EventsListRes } from '../../models/Event';
import eventsService from '../../services/eventService';


const ITEMS_LIMIT = 4;


export type EventSlice = {
  events: {
    data: EventsListRes,
    isLoading: boolean,
    error: string
  }

  fetchEventsOnce: (limit?: number) => Promise<void>
  fetchMoreEvents: (nextPage: number, limit?: number) => Promise<void>
}


export const createEventSlice: StateCreator<EventSlice> = (set) => ({

  events: {
    data: {
      currentPage: 1,
      events: [],
      eventsPerPage: ITEMS_LIMIT,
      totalEvents: 1
    },
    isLoading: false,
    error: ''
  },

  fetchEventsOnce: async (limit = ITEMS_LIMIT) => {
    set((prev) => ({
      events: {
        ...prev.events,
        isLoading: true,
      }
    }));

    try {
      const { data } = await eventsService.getEvents(1, limit, '');
      set({
        events: {
          data,
          isLoading: false,
          error: ''
        }
      });
    }
    catch (error) {
      console.log(error);
    }
  },

  fetchMoreEvents: async (nextPage: number, limit = ITEMS_LIMIT) => {
    set((prev) => ({
      events: {
        ...prev.events,
        isLoading: true,
      }
    }));

    try {
      const { data: dataRes } = await eventsService.getEvents(nextPage, limit, '');
      set((prev) => ({
        events: {
          isLoading: false,
          error: '',
          data: {
            ...dataRes,
            events: prev.events.data.events.concat(dataRes.events)
          },
        }
      }));
    }
    catch (error) {
      console.log(error);
    }
  }
});
