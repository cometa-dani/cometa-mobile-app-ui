import { StateCreator } from 'zustand';
import { IMessage } from 'react-native-gifted-chat';


export interface UserMessagesData extends Pick<IMessage, '_id' | 'user' | 'text' | 'createdAt' | 'received' | 'sent'> {
  newMessagesCount: number,
  chatUUID: string,
  messageUUID: string,
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
