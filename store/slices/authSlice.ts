/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { RestApiService } from '../../services/restService';
import { Session } from '@supabase/supabase-js';


export type AuthSlice = {
  session: Session | null
  setSession: (session: Session | null) => void,
  isLoaded: boolean,
  setIsLoaded: (isLoading: boolean) => void,
}


export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  isLoaded: false,
  setIsLoaded: (isLoading: boolean) => {
    set({ isLoaded: isLoading });
  },
  session: null,
  setSession: (session: Session | null) => {
    if (session) {
      RestApiService.getInstance().setBearerToken(session?.access_token);
    }
    set({ session });
  }
});
