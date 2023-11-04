import { User } from './User';


export interface Friendship {
  id: number;
  createdAt: string;
  updatedAt: string;
  senderId: number;
  receiverId: number;
  status: Status;
  friend: User
}

type Status = 'PENDING' | 'ACCEPTED' | 'BLOCKED'

export interface GetLatestFriendships {
  friendships: Friendship[];
  totalFriendships: number;
  nextCursor: number;
  friendshipsPerPage: number;
}
