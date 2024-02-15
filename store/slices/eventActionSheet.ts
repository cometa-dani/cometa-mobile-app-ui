/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { LikableEvent } from '../../models/Event';


export type EventAcionSheetSlice = {
  toggleActionSheet: boolean,
  setToggleActionSheet: (openOrClose: boolean) => void,
  likedEvent: LikableEvent
  setLikedEvent: (likedEvent: LikableEvent) => void,
}

export const createEventActionSheetSlice: StateCreator<EventAcionSheetSlice> = (set) => {
  return ({
    toggleActionSheet: false,
    likedEvent: {} as LikableEvent,

    setLikedEvent: (likedEvent) => {
      set(prev => ({ likedEvent }));
    },

    setToggleActionSheet: (openOrClose) => {
      set((prev) => ({ toggleActionSheet: openOrClose }));
    },
  });
};
