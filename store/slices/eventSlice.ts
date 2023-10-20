import { StateCreator } from 'zustand';
import { EventsListRes } from '../../models/Event';
import eventsService from '../../services/eventsService';


export type EventSlice = {
  events: {
    data: EventsListRes,
    isLoading: boolean,
    error: string
  }

  fetchEvents: () => Promise<void>
}


export const createEventSlice:
  StateCreator<EventSlice> = (set) => ({

    events: {
      data: {} as EventsListRes,
      isLoading: false,
      error: ''
    },

    fetchEvents: async () => {
      set((prev) => ({
        events: {
          ...prev.events,
          isLoading: true,
        }
      }));

      try {
        const { data } = await eventsService.getEvents();
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
      //
    },
  });
