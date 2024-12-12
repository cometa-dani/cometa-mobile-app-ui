import { create } from 'zustand';
import { createOnboardingSlice, IOnboardingSlice } from './slices/onBoardingSlice';
import { createUserSlice, UserSlice } from './slices/userSlice';
import { createNewPeopleSlice, NewPeopleSlice } from './slices/newPeopleSlice';
import { LatestMessagesSlice, createLatestMessagesSlice } from './slices/messagesSlices';
import { createChatGroupSlice, ChatGroupSlice } from './slices/chatGroupSlice';
import { createNotificationsSlice, NotificationsSlice } from './slices/notificationSlice';
import { createSearchFiltersSlice, SearchFiltersSlice } from './slices/searchFiltersSlice';
import { createSearchPlaceSlice, SearchPlaceSlice } from './slices/searchPlacesSlide';
import { createMatchedEventSlice, MatchecEventSlice } from './slices/eventActionSheet';


type StoreSlices = (
  IOnboardingSlice &
  UserSlice &
  NewPeopleSlice &
  LatestMessagesSlice &
  ChatGroupSlice &
  NotificationsSlice &
  SearchFiltersSlice &
  SearchPlaceSlice &
  MatchecEventSlice
);

export const useCometaStore = create<StoreSlices>(
  (...args) => ({
    ...createOnboardingSlice(...args),
    ...createUserSlice(...args),
    ...createNewPeopleSlice(...args),
    ...createLatestMessagesSlice(...args),
    ...createChatGroupSlice(...args),
    ...createNotificationsSlice(...args),
    ...createSearchFiltersSlice(...args),
    ...createSearchPlaceSlice(...args),
    ...createMatchedEventSlice(...args),
  })
);
