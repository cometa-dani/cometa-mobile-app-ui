import { EventSlice } from './slices/eventSlice';


export const selectSlices = (state: EventSlice) => ({
  events: state.events,
});

export const selectActions = (state: EventSlice) => ({
  fetchEvents: state.fetchEvents
});
