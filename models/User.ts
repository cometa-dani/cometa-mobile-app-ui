import { Friendship } from './Friendship';


// used in zustand for global CLIENT STATE
export interface UserClientState {
  id: number;
  uid: string;
  avatar: string;
  photos: Photo[];
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface Photo {
  url: string,
  uuid: string
}

export interface GetUsersWhoLikedEventWithPagination {
  usersWhoLikedEvent: UsersWhoLikedEvent[];
  nextCursor: number;
  totalUsers: number;
  usersPerPage: number;
}

export interface UsersWhoLikedEvent {
  id: number;
  createdAt: string;
  updatedAt: string;
  eventId: number;
  userId: number;
  user: UserRes;
}

// used for SERVER STATE
export interface UserRes {
  id: number;
  avatar: string;
  photos: Photo[];
  username: string;
  email: string;
  phone: null;
  uid: string;
  outgoingFriendships: Friendship[];
  incomingFriendships: Friendship[];
}
