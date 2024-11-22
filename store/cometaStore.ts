import { create } from 'zustand';
import { createOnboardingSlice, OnboardingSlice } from './slices/onBoardingSlice';
import { createUserSlice, UserSlice } from './slices/userSlice';
import { createNewPeopleSlice, NewPeopleSlice } from './slices/newPeopleSlice';
import { LatestMessagesSlice, createLatestMessagesSlice } from './slices/messagesSlices';
import { createChatGroupSlice, ChatGroupSlice } from './slices/chatGroupSlice';
import { createNotificationsSlice, NotificationsSlice } from './slices/notificationSlice';
import { createSearchFiltersSlice, SearchFiltersSlice } from './slices/searchFiltersSlice';
import { createSearchPlaceSlice, SearchPlaceSlice } from './slices/searchPlacesSlide';


type StoreSlices = OnboardingSlice & UserSlice & NewPeopleSlice & LatestMessagesSlice & ChatGroupSlice & NotificationsSlice & SearchFiltersSlice & SearchPlaceSlice;

export const useCometaStore = create<StoreSlices>(
  (...args) => ({
    ...createOnboardingSlice(...args),
    ...createUserSlice(...args),
    ...createNewPeopleSlice(...args),
    ...createLatestMessagesSlice(...args),
    ...createChatGroupSlice(...args),
    ...createNotificationsSlice(...args),
    ...createSearchFiltersSlice(...args),
    ...createSearchPlaceSlice(...args)
  })
);
