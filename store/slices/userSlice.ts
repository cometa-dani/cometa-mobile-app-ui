/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { UserRes } from '../../models/User';


export type UserSlice = {
  user: Partial<UserRes>,
  isAuthenticated: boolean,
  accessToken: string,

  setUser: (user: Partial<UserRes>) => void,
  setIsAuthenticated: (isAuth: boolean) => void,
  setAccessToken: (authToken: string) => void
}


export const createUserSlice: StateCreator<UserSlice> = (set) => ({

  user: {} as UserRes,

  isAuthenticated: false,
  accessToken: '',

  setUser: (user: Partial<UserRes>) => {
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
