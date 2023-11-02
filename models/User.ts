import { Friendship } from './Friendship';


export interface UserRes {
  id: number;
  uid: string;
  avatar: string;
  photos: Photo[];
  username: string;
  email: string;
  phone: string;
  // password: string;
}

export interface Photo {
  url: string,
  uuid: string
}

export interface GetUsersWhoLikedSameEvent {
  usersWhoLikedEvent: UsersWhoLikedSameEvent[];
  nextCursor: number;
  totalUsers: number;
  usersPerPage: number;
}

export interface UsersWhoLikedSameEvent {
  id: number;
  avatar: string;
  photos: Photo[];
  username: string;
  email: string;
  phone: null;
  uid: string;
  incomingFriendships: object[];
  outgoingFriendships: object[];
  _count?: Count;
}

export interface Count {
  likedEvents: number;
  matches: number;
  outgoingFriendships: number;
  incomingFriendships: number;
  outgoingNotification: number;
  incomingNotification: number;
}

export interface GetUserWhoLikedEvent {
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
  user: User;
}

export interface User {
  id: number;
  avatar: string;
  photos: object[];
  username: string;
  email: string;
  phone: null;
  uid: string;
  outgoingFriendships: Friendship[];
  incomingFriendships: Friendship[];
}
