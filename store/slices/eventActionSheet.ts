/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { IEvent, ILikeableEvent } from '../../models/Event';


export type MatchecEventSlice = {
  toggleActionSheet: boolean,
  setToggleActionSheet: (openOrClose: boolean) => void,
  likedEvent: IEvent
  setLikedEvent: (likedEvent: IEvent) => void,
}

export const createMatchedEventSlice: StateCreator<MatchecEventSlice> = (set) => {
  return ({
    toggleActionSheet: false,
    likedEvent: {} as IEvent,

    setLikedEvent: (likedEvent) => {
      set(prev => ({ likedEvent }));
    },

    setToggleActionSheet: (openOrClose) => {
      set((prev) => ({ toggleActionSheet: openOrClose }));
    },
  });
};
