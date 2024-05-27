import { StateCreator } from 'zustand';


export interface INotificationData {
  chatUUID?: string,
  createdAt: Date | number,
  user: {
    _id: string,
    name: string,
    avatar: string
  },
}

export type NotificationsSlice = {
  notificationsList: INotificationData[],
  setNotificationsList: (messages: INotificationData[]) => void
}

export const createNotificationsSlice: StateCreator<NotificationsSlice> = (set) => {
  return ({
    notificationsList: [],
    setNotificationsList: (messages) => {
      set({ notificationsList: messages });
    }
  });
};
