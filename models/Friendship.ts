import { IMessage } from 'react-native-gifted-chat';
import { IGetBasicUserProfile } from './User';
import { IPaginated } from './utils/Paginated';


export interface IFriendship {
  id: number;
  createdAt: string;
  updatedAt: string;
  senderId: number;
  receiverId: number;
  status: FriendShipStatus;
  friend: IGetBasicUserProfile;
  messages: IMessage[];
  lastMessageAt: Date | string;
}

export type FriendShipStatus = 'PENDING' | 'ACCEPTED' | 'BLOCKED'

export interface IGetLatestFriendships extends IPaginated<IFriendship> { }

export type MutateFrienship = Pick<IFriendship, (
  'id' |
  'senderId' |
  'receiverId' |
  'status' |
  'createdAt' |
  'updatedAt'
)>

export interface IGetFriendship extends Omit<IFriendship, 'friend'> {
  sender: IGetBasicUserProfile;
  receiver: IGetBasicUserProfile;
}

export interface ILastMessage extends IFriendship {
  sender: IGetBasicUserProfile;
  receiver: IGetBasicUserProfile;
  lastMessage?: IMessage;
}
