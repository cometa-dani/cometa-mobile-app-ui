import { IMessage } from 'react-native-gifted-chat';
import { IGetBasicUserProfile } from './User';
import { IPaginated } from './utils/Paginated';


export interface Friendship {
  id: number;
  createdAt: string;
  updatedAt: string;
  senderId: number;
  receiverId: number;
  // chatuuid: string;
  status: FriendShipStatus;
  friend: IGetBasicUserProfile;
  messages: IMessage[];
  lastMessageAt: Date | string;
}

export type FriendShipStatus = 'PENDING' | 'ACCEPTED' | 'BLOCKED'

export interface IGetLatestFriendships extends IPaginated<Friendship> { }

export type MutateFrienship = Pick<Friendship, (
  'id' |
  'senderId' |
  'receiverId' |
  'status' |
  // 'chatuuid' |
  'createdAt' |
  'updatedAt'
)>

export interface GetFriendShipWithSenderAndReceiver extends Omit<Friendship, 'friend'> {
  sender: IGetBasicUserProfile;
  receiver: IGetBasicUserProfile;
}
