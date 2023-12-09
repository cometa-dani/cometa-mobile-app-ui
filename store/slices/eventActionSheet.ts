/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { LikedEvent } from '../../models/Event';


export type EventAcionSheetSlice = {
  toggleActionSheet: boolean,
  setToggleActionSheet: (openOrClose: boolean) => void,
  likedEvent: LikedEvent
  setLikedEvent: (likedEvent: LikedEvent) => void,
}

export const createEventActionSheetSlice: StateCreator<EventAcionSheetSlice> = (set) => {
  return ({
    toggleActionSheet: false,
    likedEvent: {} as LikedEvent,

    setLikedEvent: (likedEvent) => {
      set(prev => ({ likedEvent }));
    },

    setToggleActionSheet: (openOrClose) => {
      set((prev) => ({ toggleActionSheet: openOrClose }));
    },
  });
};
