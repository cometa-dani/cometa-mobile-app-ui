import { create } from 'zustand';
import { createOnboardingSlice, OnboardingSlice } from './slices/onBoarding';
import { createUserSlice, UserSlice } from './slices/userSlice';
import { createNewPeopleSlice, NewPeopleSlice } from './slices/newPeopleSlice';
import { LatestMessagesSlice, createLatestMessagesSlice } from './slices/messagesSlices';
import { createChatGroupSlice, ChatGroupSlice } from './slices/chatGroupSlice';


type StoreSlices = OnboardingSlice & UserSlice & NewPeopleSlice & LatestMessagesSlice & ChatGroupSlice;

export const useCometaStore = create<StoreSlices>(
  (...args) => ({
    ...createOnboardingSlice(...args),
    ...createUserSlice(...args),
    ...createNewPeopleSlice(...args),
    ...createLatestMessagesSlice(...args),
    ...createChatGroupSlice(...args)
  })
);
