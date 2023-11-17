import { GetBasicUserProfile } from './User';


export interface Friendship {
  id: number;
  createdAt: string;
  updatedAt: string;
  senderId: number;
  sender: GetBasicUserProfile;
  receiverId: number;
  receiver: GetBasicUserProfile
  status: Status;
  friend: GetBasicUserProfile
}

export type Status = 'PENDING' | 'ACCEPTED' | 'BLOCKED'

export interface GetLatestFriendships {
  friendships: Friendship[];
  totalFriendships: number;
  nextCursor: number;
  friendshipsPerPage: number;
}
