/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { IMessage } from 'react-native-gifted-chat';


export interface UserMessagesData extends Pick<IMessage, 'user' | 'text' | 'createdAt'> {
  newMessagesCount: number,
  chatUUID: string
}

export type MessagesSlice = {
  friendsMessagesList: UserMessagesData[],
  setFriendsMessagesList: (messages: UserMessagesData[]) => void
}

export const createMessagesSlice: StateCreator<MessagesSlice> = (set) => {
  return ({
    friendsMessagesList: [],
    setFriendsMessagesList: (messages) => {
      set({ friendsMessagesList: messages });
    }
  });
};
