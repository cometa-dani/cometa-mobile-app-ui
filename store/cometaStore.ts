import { create } from 'zustand';
import { createEventSlice, EventSlice } from './slices/eventSlice';
import { createOnboardingSlice, OnboardingSlice } from './slices/onBoarding';
import { createUserSlice, UserSlice } from './slices/userSlice';


type StoreSlices = EventSlice & OnboardingSlice & UserSlice;

export const useCometaStore = create<StoreSlices>(
  (...args) => ({
    ...createEventSlice(...args),
    ...createOnboardingSlice(...args),
    ...createUserSlice(...args)
  })
);
