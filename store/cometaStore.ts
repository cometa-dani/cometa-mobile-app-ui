import { create } from 'zustand';
// import { createEventSlice, EventSlice } from './slices/eventSlice';
import { createOnboardingSlice, OnboardingSlice } from './slices/onBoarding';
import { createUserSlice, UserSlice } from './slices/userSlice';


type StoreSlices = OnboardingSlice & UserSlice;

export const useCometaStore = create<StoreSlices>(
  (...args) => ({
    ...createOnboardingSlice(...args),
    ...createUserSlice(...args)
  })
);
