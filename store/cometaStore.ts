import { create } from 'zustand';
import { createOnboardingSlice, OnboardingSlice } from './slices/onBoarding';
import { createUserSlice, UserSlice } from './slices/userSlice';
import { createNewPeopleSlice, NewPeopleSlice } from './slices/newPeopleSlice';
import { createEventActionSheetSlice, EventAcionSheetSlice } from './slices/eventActionSheet';


type StoreSlices = OnboardingSlice & UserSlice & NewPeopleSlice & EventAcionSheetSlice;

export const useCometaStore = create<StoreSlices>(
  (...args) => ({
    ...createOnboardingSlice(...args),
    ...createUserSlice(...args),
    ...createNewPeopleSlice(...args),
    ...createEventActionSheetSlice(...args)
  })
);
