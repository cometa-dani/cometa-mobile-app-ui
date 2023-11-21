import { create } from 'zustand';
import { createOnboardingSlice, OnboardingSlice } from './slices/onBoarding';
import { createUserSlice, UserSlice } from './slices/userSlice';
import { createNewPeopleSlice, NewPeopleSlice } from './slices/newPeopleSlice';

type StoreSlices = OnboardingSlice & UserSlice & NewPeopleSlice;

export const useCometaStore = create<StoreSlices>(
  (...args) => ({
    ...createOnboardingSlice(...args),
    ...createUserSlice(...args),
    ...createNewPeopleSlice(...args)
  })
);
