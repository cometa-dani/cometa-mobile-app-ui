import { Friendship, Status } from './Friendship';


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


export interface GetUserProfile {
  id: number;
  avatar: string;
  photos: Photo[];
  username: string;
  email: string;
  phone: null;
  uid: string;
  likedEvents: LikedEvent[];
  incomingFriendships: OutgoingFriendship[];
  outgoingFriendships: OutgoingFriendship[];
  _count: Count;
}

export interface Count {
  likedEvents: number;
  incomingFriendships: number;
  outgoingFriendships: number;
}

export interface LikedEvent {
  id: number;
  createdAt: string;
  updatedAt: string;
  eventId: number;
  userId: number;
  event: Event;
}

export interface Event {
  mediaUrl: string;
  name: string;
}

export interface OutgoingFriendship {
  id: number;
  createdAt: string;
  updatedAt: string;
  senderId: number;
  receiverId: number;
  status: Status;
}
