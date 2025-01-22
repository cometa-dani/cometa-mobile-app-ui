/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { RestApiService } from '../../services/restService';
import { Session } from '@supabase/supabase-js';
import { IGetDetailedUserProfile } from '@/models/User';


export type AuthSlice = {
  session: Session | null
  setSession: (session: Session | null) => void,
  isLoaded: boolean,
  setIsLoaded: (isLoading: boolean) => void,
  isAuthenticated: boolean,
  setIsAuthenticated: (isAuthenticated: boolean) => void,
  setUserProfile: (user: IGetDetailedUserProfile) => void,
  userProfile?: IGetDetailedUserProfile,
  newMessages: number
  setNewMessages: (newMessages: number) => void
}


export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  isLoaded: false,
  newMessages: 0,
  setNewMessages: (newMessages: number) => {
    set({ newMessages });
  },
  setIsLoaded: (isLoading: boolean) => {
    set({ isLoaded: isLoading });
  },
  session: null,
  setSession: (session: Session | null) => {
    if (session) {
      RestApiService.getInstance().setBearerToken(session?.access_token);
    }
    set({ session });
  },
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated: boolean) => {
    set({ isAuthenticated });
  },
  shouldFetchUserProfile: false,
  setUserProfile: (user: IGetDetailedUserProfile) => {
    set({ userProfile: user });
  },
  userProfile: undefined
});
