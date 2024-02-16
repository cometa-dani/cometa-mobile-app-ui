import { GetBasicUserProfile } from './User';


export interface Friendship {
  id: number;
  createdAt: string;
  updatedAt: string;
  senderId: number;
  sender: GetBasicUserProfile;
  receiverId: number;
  receiver: GetBasicUserProfile
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
