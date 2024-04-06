/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { IMessage } from 'react-native-gifted-chat';


export interface UserMessagesData extends Pick<IMessage, 'user' | 'text' | 'createdAt'> {
  newMessagesCount: number,
  chatUUID: string,
  isChatGroup: boolean
}

export type LatestMessagesSlice = {
  friendsLatestMessagesList: UserMessagesData[],
  setFriendsLatestMessagesList: (messages: UserMessagesData[]) => void
}

export const createLatestMessagesSlice: StateCreator<LatestMessagesSlice> = (set) => {
  return ({
    friendsLatestMessagesList: [],
    setFriendsLatestMessagesList: (messages) => {
      set({ friendsLatestMessagesList: messages });
    }
  });
};
