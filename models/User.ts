/* eslint-disable no-unused-vars */
import { ImagePickerAsset } from 'expo-image-picker';
import { EventCategory, LikeableEvent } from './Event';
import { Friendship } from './Friendship';
import { Photo } from './Photo';


enum Gender {
  MALE,
  FEMALE,
  BINARY,
  GAY,
  BISEXUAL,
  LESBIAN,
  OTHER,
}

enum RelationshipStatus {
  SINGLE,
  IN_A_RELATIONSHIP,
  MARRIED,
  DIVORCED,
  WIDOWED,
  OTHER,
}

enum Diet {
  OMNIVORE,
  VEGETARIAN,
  VEGAN,
  PESCATARIAN,
}

enum Religion {
  CHRISTIANITY,
  ISLAM,
  HINDUISM,
  BUDDHISM,
  SIKHISM,
  JUDAISM,
  ATHEISM,
  AGNOSTICISM,
  OTHER
}

enum Ethnicity {
  WHITE,
  HISPANIC,
  LATINO,
  BLACK,
  ASIAN,
  MIDDLE_EASTERN,
  NATIVE_AMERICAN,
  PACIFIC_ISLANDER,
  MIXED,
  OTHER,
}

enum ExerciseFrequency {
  NEVER,
  RARELY,
  SOMETIMES,
  OFTEN,
  DAILY
}

enum LookingFor {
  MEET_NEW_PEOPLE,
  DISCOVER_NEW_EVENTS,
  FIND_NEW_PLACES,
  FRIENDSHIP,
  RELATIONSHIP,
  NETWORKING,
}

enum Education {
  SECONDARY,
  UNIVERSITY,
  HIGH_SCHOOL,
  SOME_COLLEGE,
  BACHELORS,
  MASTERS,
  DOCTORATE,
  OTHER
}

// used in zustand store for global CLIENT STATE
export interface LoggedUserClientState extends Pick<GetBasicUserProfile, (
  'id' |
  'uid' |
  'username' |
  'birthday' |
  'occupation' |
  'email' |
  'name' |
  'biography' |
  'currentLocation' |
  'homeTown' |
  'languages'
)> {
  password: string;
  imageRef: ImagePickerAsset;
}

export interface GetMatchedUsersWhoLikedEventWithPagination {
  usersWhoLikedEvent: MatchedUsersWhoLikedEvent[];
  nextCursor: number;
  totalUsers: number;
  hasNextCursor: boolean;
  usersPerPage: number;
}

export interface MatchedUsersWhoLikedEvent {
  id: number;
  createdAt: string;
  updatedAt: string;
  eventId: number;
  userId: number;
  user: GetBasicUserProfile;
}

type Event = Pick<LikeableEvent, ('photos' | 'name')>

type OutgoingFriendship =
  Pick<Friendship, (
    'id' |
    'createdAt' |
    'updatedAt' |
    'senderId' |
    'receiverId' |
    'status'
  )>

export interface GetBasicUserProfile extends
  Pick<GetDetailedUserProfile, (
    'id' |
    'uid' |
    'photos' |
    'username' |
    'name' |
    'biography' |
    'email' |
    'phone' |

    'birthday' |
    'homeTown' |
    'currentLocation' |
    'languages' |
    'interests' |
    'activateNotifications' |
    'lookingFor' |
    'occupation' |
    'educationLevel'
  )> {
  hasOutgoingFriendship: boolean;
  hasIncommingFriendship: boolean;
}


export interface GetUsersWithPagination {
  users: Omit<GetBasicUserProfile, 'outgoingFriendships' | 'incomingFriendships'>[];
  nextCursor: number;
  totalUsers: number;
  usersPerPage: number;
  hasNextCursor: boolean;
}


export interface GetDetailedUserProfile {
  id: number;
  avatar?: string;
  photos: Photo[];
  maxNumPhotos: number;
  username: string;
  name: string
  biography: string;
  email: string;
  phone?: string;

  currentLocation?: string;
  homeTown?: string;
  languages?: string[];
  height?: number;
  weight?: number;
  favoriteSports?: string[];
  music?: string[];
  lookingFor?: LookingFor;
  occupation?: string;

  educationLevel?: Education;
  relationshipStatus?: RelationshipStatus;
  pets?: string[];
  smoking?: boolean;
  drinking?: boolean;
  religion?: Religion;
  ethnicity?: Ethnicity
  children?: boolean;
  company?: string;
  verified?: boolean;
  gender?: Gender
  diet?: Diet
  exerciseFrequency?: ExerciseFrequency
  birthday?: Date;
  interests?: EventCategory[];
  activateNotifications: boolean;

  uid: string;
  likedEvents: LikedEvent[];
  // sharedEvents: sharedEvent[];

  // _count: Count;
}


export interface GetTargetUser extends GetDetailedUserProfile {
  isFriend: boolean;
  incomingFriendships: OutgoingFriendship[];
  outgoingFriendships: OutgoingFriendship[];
}


interface LikedEvent {
  id: number;
  createdAt: string;
  updatedAt: string;
  eventId: number;
  userId: number;
  event: Event;
}
