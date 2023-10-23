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

  fetchEvents: (page: number, limit?: number) => Promise<void>
  fetchMoreEvents: (page: number, limit?: number) => Promise<void>
}


export const createEventSlice: StateCreator<EventSlice> = (set) => ({

  events: {
    data: {} as EventsListRes,
    isLoading: false,
    error: ''
  },

  fetchEvents: async (page = 1, limit = 4) => {
    set((prev) => ({
      events: {
        ...prev.events,
        isLoading: true,
      }
    }));

    try {
      const { data } = await eventsService.getEvents(page, limit);
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

  fetchMoreEvents: async (page: number, limit = 4) => {
    set((prev) => ({
      events: {
        ...prev.events,
        isLoading: true,
      }
    }));

    try {
      const { data: dataRes } = await eventsService.getEvents(page, limit);
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
