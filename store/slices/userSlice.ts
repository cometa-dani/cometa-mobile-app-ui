/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';


export type UserSlice = {
  isAuthenticated: boolean,
  accessToken: string,
  uid: string,

  setIsAuthenticated: (isAuth: boolean) => void,
  setAccessToken: (authToken: string) => void,
  setUid: (uid: string) => void
}


export const createUserSlice: StateCreator<UserSlice> = (set) => ({

  isAuthenticated: false,
  accessToken: '',
  uid: '',

  setUid: (uid: string) => {
    set({ uid });
  },

  setIsAuthenticated: (isAth: boolean) => {
    set({ isAuthenticated: isAth });
  },

  setAccessToken: (authToken: string) => {
    set({ accessToken: authToken });
  }
});
