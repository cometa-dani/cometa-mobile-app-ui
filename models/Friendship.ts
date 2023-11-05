import { UserRes } from './User';


export interface Friendship {
  id: number;
  createdAt: string;
  updatedAt: string;
  senderId: number;
  sender: UserRes;
  receiverId: number;
  receiver: UserRes
  status: Status;
  friend: UserRes
}

type Status = 'PENDING' | 'ACCEPTED' | 'BLOCKED'

export interface GetLatestFriendships {
  friendships: Friendship[];
  totalFriendships: number;
  nextCursor: number;
  friendshipsPerPage: number;
}
