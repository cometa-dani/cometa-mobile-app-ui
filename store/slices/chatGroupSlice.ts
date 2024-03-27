import { StateCreator } from 'zustand';
import { UserMessagesData } from './messagesSlices';


export type ChatGroupSlice = {
  chatGroupMembers: UserMessagesData[];
  setChatGroupMembers: (member: UserMessagesData) => void;
}

export const createChatGroupSlice: StateCreator<ChatGroupSlice> = ((set) => ({
  chatGroupMembers: [],
  setChatGroupMembers: (member) => {
    set(prev => ({
      chatGroupMembers:
        prev.chatGroupMembers.some(gm => gm.user._id === member.user._id) // if member is already in the group, remove them
          ? prev.chatGroupMembers.filter(gm => gm.user._id !== member.user._id) // remove member
          : prev.chatGroupMembers.concat(member) // add member
    }));
  },
}));
