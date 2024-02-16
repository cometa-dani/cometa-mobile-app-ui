/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { LikeableEvent } from '../../models/Event';


export type EventAcionSheetSlice = {
  toggleActionSheet: boolean,
  setToggleActionSheet: (openOrClose: boolean) => void,
  likedEvent: LikeableEvent
  setLikedEvent: (likedEvent: LikeableEvent) => void,
}

export const createEventActionSheetSlice: StateCreator<EventAcionSheetSlice> = (set) => {
  return ({
    toggleActionSheet: false,
    likedEvent: {} as LikeableEvent,

    setLikedEvent: (likedEvent) => {
      set(prev => ({ likedEvent }));
    },

    setToggleActionSheet: (openOrClose) => {
      set((prev) => ({ toggleActionSheet: openOrClose }));
    },
  });
};
