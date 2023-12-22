/* eslint-disable no-unused-vars */
import { ImagePickerAsset } from 'expo-image-picker';
import { EventCategory } from './Event';
import { Friendship, Status } from './Friendship';


// used in zustand store for global CLIENT STATE
export interface UserClientState extends GetBasicUserProfile {
  password: string;
  imageRef: ImagePickerAsset;
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
  user: GetBasicUserProfile;
}

enum LookingFor {
  MEET_NEW_PEOPLE,
  DISCOVER_NEW_EVENTS
}

enum Education {
  SECONDARY,
  UNIVERSITY,
  POST_GRADUATE,
  NONE
}

// used in react query for SERVER STATE
export interface GetBasicUserProfile {
  id: number;
  avatar: string;
  photos: Photo[];
  username: string;
  name: string
  biography: string;
  email: string;
  phone?: string;

  birthday?: Date;
  address?: string;
  interests?: EventCategory[];
  activateNotifications: boolean;
  lookingFor?: LookingFor;
  occupation?: string;
  education?: Education

  uid: string;
  outgoingFriendships: Friendship[];
  incomingFriendships: Friendship[];
}


export interface GetDetailedUserProfile {
  id: number;
  avatar: string;
  photos: Photo[];
  maxNumPhotos: number;
  username: string;
  name: string
  biography: string;
  email: string;
  phone?: string;

  birthday?: Date;
  address?: string;
  interests?: EventCategory[];
  activateNotifications: boolean;
  lookingFor?: LookingFor;
  occupation?: string;
  education?: Education

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
  mediaType: 'IMAGE' | 'VIDEO';
}

export interface OutgoingFriendship {
  id: number;
  createdAt: string;
  updatedAt: string;
  senderId: number;
  receiverId: number;
  status: Status;
}
