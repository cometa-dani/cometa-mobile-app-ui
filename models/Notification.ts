import { IGetBasicUserProfile } from './User';


export interface INotification {
  id: number;
  createdAt: string;
  updatedAt: string;
  sender: IGetBasicUserProfile;
  senderId: number;
  receiver: IGetBasicUserProfile;
  receiverId: number;
  message: string,
  type: string,
  read: boolean,
  user: IGetBasicUserProfile,
  userId: number
}
