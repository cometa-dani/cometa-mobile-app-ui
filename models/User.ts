/* eslint-disable no-unused-vars */
import { ImagePickerAsset } from 'expo-image-picker';
import { EventCategory, LikeableEvent } from './Event';
import { Friendship } from './Friendship';
import { Photo } from './Photo';
import { PhotoPlaceholder } from '@/components/onboarding/bottomSheet/photosGrid/photosGrid';


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
export interface IUserClientState extends Pick<GetBasicUserProfile, (
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
  // 'photos'
)> {
  photos: PhotoPlaceholder[]
  password: string;
  repassword: string;
  imageRef?: ImagePickerAsset;
}

export type ICreateUser = Pick<IUserClientState, (
  'uid' |
  'email' |
  'username' |
  'name' |
  'birthday'
)>

export type IUpdateUser = Partial<Omit<GetDetailedUserProfile, (
  'outgoingFriendships' | 'incomingFriendships' | 'likedEvents' | 'id'
)>>

export interface GetMatchedUsersWhoLikedEventWithPagination {
  items: MatchedUsersWhoLikedEvent[];
  nextCursor: number;
  totalItems: number;
  hasNextCursor: boolean;
  itemsPerPage: number;
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
  items: Omit<GetBasicUserProfile, 'outgoingFriendships' | 'incomingFriendships'>[];
  nextCursor: number;
  totalItems: number;
  hasNextCursor: boolean;
  itemsPerPage: number;
}


export interface GetDetailedUserProfile {
  id: number;
  photos: Photo[];
  maxNumPhotos: number;
  username: string;
  name: string
  biography: string;
  email: string;
  phone?: string;
  birthday?: Date | string;
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

  interests?: EventCategory[];
  activateNotifications: boolean;

  uid: string;
  likedEvents: LikedEvent[];
  // sharedEvents: sharedEvent[];
}


export interface GetTargetUser extends GetDetailedUserProfile {
  isFriend: boolean;
  hasOutgoingFriendship: boolean;
  hasIncommingFriendship: boolean
}


interface LikedEvent {
  id: number;
  createdAt: string;
  updatedAt: string;
  eventId: number;
  userId: number;
  event: Event;
}
