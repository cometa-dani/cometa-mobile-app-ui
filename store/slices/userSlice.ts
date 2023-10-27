/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { UserRes } from '../../models/User';


export type UserSlice = {
  user: Partial<UserRes>,
  isAuthenticated: boolean

  setUser: (user: Partial<UserRes>) => void
  setIsAuthenticated: (isAuth: boolean) => void
}


export const createUserSlice: StateCreator<UserSlice> = (set) => ({

  user: {} as UserRes,

  isAuthenticated: false,

  setUser: (user: Partial<UserRes>) => {
    set({
      user
    });
  },

  setIsAuthenticated: (isAth: boolean) => {
    set({ isAuthenticated: isAth });
  }
});
