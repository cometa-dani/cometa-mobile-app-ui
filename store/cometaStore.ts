import { create } from 'zustand';
import { createEventSlice, EventSlice } from './slices/eventSlice';


export const useCometaStore = create<EventSlice>((...args) => ({
  ...createEventSlice(...args)
}));
