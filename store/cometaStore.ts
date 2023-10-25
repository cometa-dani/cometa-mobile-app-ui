import { create } from 'zustand';
import { createEventSlice, EventSlice } from './slices/eventSlice';
import { createOnboardingSlice, OnboardingSlice } from './slices/onBoarding';


export const useCometaStore = create<EventSlice & OnboardingSlice>((...args) => ({
  ...createEventSlice(...args),
  ...createOnboardingSlice(...args)
}));
