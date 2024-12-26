import { IGetTargetUser } from '@/models/User';
import { StateCreator } from 'zustand';


export type TargetUserSlice = {
  targetUser?: IGetTargetUser;
  setTargetUser: (targetUser: IGetTargetUser) => void;
}

export const createTargetUserSlice: StateCreator<TargetUserSlice> = (set) => {
  return ({
    targetUser: undefined,
    setTargetUser: (targetUser) => {
      set({ targetUser });
    }
  });
};
