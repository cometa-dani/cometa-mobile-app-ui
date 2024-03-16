import { GetBasicUserProfile } from './User';


export interface Friendship {
  id: number;
  createdAt: string;
  updatedAt: string;
  senderId: number;
  receiverId: number;
  chatuuid: string;
  status: FriendShipStatus;
  friend: GetBasicUserProfile
}

export type FriendShipStatus = 'PENDING' | 'ACCEPTED' | 'BLOCKED'

export interface GetLatestFriendships {
  friendships: Friendship[];
  totalFriendships: number;
  nextCursor: number;
  friendshipsPerPage: number;
}

export type MutateFrienship = Pick<Friendship, (
  'id' |
  'senderId' |
  'receiverId' |
  'status' |
  'chatuuid' |
  'createdAt' |
  'updatedAt'
)>

export interface GetFriendShipWithSenderAndReceiver extends Omit<Friendship, 'friend'> {
  sender: GetBasicUserProfile;
  receiver: GetBasicUserProfile;
}
