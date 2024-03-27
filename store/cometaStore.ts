import { create } from 'zustand';
import { createOnboardingSlice, OnboardingSlice } from './slices/onBoarding';
import { createUserSlice, UserSlice } from './slices/userSlice';
import { createNewPeopleSlice, NewPeopleSlice } from './slices/newPeopleSlice';
import { MessagesSlice, createMessagesSlice } from './slices/messagesSlices';
import { createChatGroupSlice, ChatGroupSlice } from './slices/chatGroupSlice';


type StoreSlices = OnboardingSlice & UserSlice & NewPeopleSlice & MessagesSlice & ChatGroupSlice;

export const useCometaStore = create<StoreSlices>(
  (...args) => ({
    ...createOnboardingSlice(...args),
    ...createUserSlice(...args),
    ...createNewPeopleSlice(...args),
    ...createMessagesSlice(...args),
    ...createChatGroupSlice(...args)
  })
);
