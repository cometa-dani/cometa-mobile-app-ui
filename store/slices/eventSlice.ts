/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { EventsListRes } from '../../models/Event';
import eventsService from '../../services/eventsService';


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
    data: {} as EventsListRes,
    isLoading: false,
    error: ''
  },

  fetchEventsOnce: async (limit = 4) => {
    set((prev) => ({
      events: {
        ...prev.events,
        isLoading: true,
      }
    }));

    try {
      const { data } = await eventsService.getEvents(1, limit);
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

  fetchMoreEvents: async (nextPage: number, limit = 4) => {
    set((prev) => ({
      events: {
        ...prev.events,
        isLoading: true,
      }
    }));

    try {
      const { data: dataRes } = await eventsService.getEvents(nextPage, limit);
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
