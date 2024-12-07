/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { RestApiService } from '../../services/restService';
import { Session } from '@supabase/supabase-js';


export type UserSlice = {
  isAuthenticated: boolean,
  accessToken: string,
  uid: string,
  // TODO: add userProfile info
  session?: Session
  setSession: (session: Session) => void

  setIsAuthenticated: (isAuth: boolean) => void,
  setAccessToken: (authToken: string) => void,
  setUid: (uid: string) => void
}


export const createUserSlice: StateCreator<UserSlice> = (set) => ({

  isAuthenticated: false,
  accessToken: '',
  uid: '',
  session: undefined,
  setSession: (session: Session) => {
    RestApiService.getInstance().setBearerToken(session.access_token);
    set({ session });
  },

  setUid: (uid: string) => {
    set({ uid });
  },

  setIsAuthenticated: (isAth: boolean) => {
    set({ isAuthenticated: isAth });
  },

  setAccessToken: (authToken: string) => {
    RestApiService.getInstance().setBearerToken(authToken);
    set({ accessToken: authToken });
  }
});
