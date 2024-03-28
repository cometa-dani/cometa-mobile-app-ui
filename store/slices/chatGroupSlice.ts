import { StateCreator } from 'zustand';
import { UserMessagesData } from './messagesSlices';
import { PhotoRef } from '../../models/Photo';


export type ChatGroupSlice = {
  chatGroupMembers: Map<string | number, UserMessagesData>;
  imageRef: PhotoRef;
  setChatGroupMembers: (member: UserMessagesData) => void;
  setImageRef: (imageRef: PhotoRef) => void;
  resetChatGroupMembers: () => void;
}


export const createChatGroupSlice: StateCreator<ChatGroupSlice> = ((set) => ({

  chatGroupMembers: new Map<string, UserMessagesData>(),

  imageRef: {} as PhotoRef,

  setChatGroupMembers: (member) => {
    set(prev => {
      const prevMembers = new Map(prev.chatGroupMembers);
      const hasMember = prevMembers.has(member.user._id);
      if (hasMember) {
        prevMembers.delete(member.user._id);
        return { chatGroupMembers: prevMembers };
      }
      const newMemberAdded = prevMembers.set(member.user._id, member);
      return { chatGroupMembers: newMemberAdded };
    });
  },

  setImageRef: (imageRef) => {
    set({ imageRef });
  },

  resetChatGroupMembers: () => {
    set({
      chatGroupMembers: new Map<string, UserMessagesData>(),
      imageRef: {} as PhotoRef
    });
  }
}));
