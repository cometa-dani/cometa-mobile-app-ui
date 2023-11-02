/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { UserClientState } from '../../models/User';


export type UserSlice = {
  user: Partial<UserClientState>,
  isAuthenticated: boolean,
  accessToken: string,

  setUser: (user: Partial<UserClientState>) => void,
  setIsAuthenticated: (isAuth: boolean) => void,
  setAccessToken: (authToken: string) => void
}


export const createUserSlice: StateCreator<UserSlice> = (set) => ({

  user: {} as UserClientState,

  isAuthenticated: false,
  accessToken: '',

  setUser: (user: Partial<UserClientState>) => {
    set({
      user
    });
  },

  setIsAuthenticated: (isAth: boolean) => {
    set({ isAuthenticated: isAth });
  },

  setAccessToken: (authToken: string) => {
    set({ accessToken: authToken });
  }
});
