/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { GetBasicUserProfile, GetDetailedUserProfile } from '../../models/User';


type User = GetBasicUserProfile | GetDetailedUserProfile

export type NewPeopleSlice = {
  toggleModal: boolean,
  setToggleModal: () => void,
  incommginFriendshipSender: User
  setIncommginFriendshipSender: (user: User) => void,
}

export const createNewPeopleSlice: StateCreator<NewPeopleSlice> = (set) => {
  return ({
    toggleModal: false,
    incommginFriendshipSender: {} as User,

    setIncommginFriendshipSender: (user) => {
      set({ incommginFriendshipSender: user });
    },

    setToggleModal: () => {
      set((prev) => ({ toggleModal: !prev.toggleModal }));
    },
  });
};
