import { IGetBasicUserProfile } from './User';


export interface Friendship {
  id: number;
  createdAt: string;
  updatedAt: string;
  senderId: number;
  receiverId: number;
  chatuuid: string;
  status: FriendShipStatus;
  friend: IGetBasicUserProfile
}

export type FriendShipStatus = 'PENDING' | 'ACCEPTED' | 'BLOCKED'

// export interface GetLatestFriendships {
//   friendships: Friendship[];
//   totalFriendships: number;
//   nextCursor: number;
//   friendshipsPerPage: number;
//   hasNextCursor: boolean;
// }

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
  sender: IGetBasicUserProfile;
  receiver: IGetBasicUserProfile;
}
