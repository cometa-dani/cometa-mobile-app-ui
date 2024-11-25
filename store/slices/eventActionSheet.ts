/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { ILikeableEvent } from '../../models/Event';


export type EventAcionSheetSlice = {
  toggleActionSheet: boolean,
  setToggleActionSheet: (openOrClose: boolean) => void,
  likedEvent: ILikeableEvent
  setLikedEvent: (likedEvent: ILikeableEvent) => void,
}

export const createEventActionSheetSlice: StateCreator<EventAcionSheetSlice> = (set) => {
  return ({
    toggleActionSheet: false,
    likedEvent: {} as ILikeableEvent,

    setLikedEvent: (likedEvent) => {
      set(prev => ({ likedEvent }));
    },

    setToggleActionSheet: (openOrClose) => {
      set((prev) => ({ toggleActionSheet: openOrClose }));
    },
  });
};
