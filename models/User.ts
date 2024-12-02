/* eslint-disable no-unused-vars */
import { EventCategory, ILikeableEvent } from './Event';
import { IPhoto } from './Photo';
import { IPhotoPlaceholder } from '@/components/onboarding/user/photosGrid/photosGrid';
import { IPaginated } from './utils/Paginated';


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

export interface IUserOnboarding extends Pick<IGetBasicUserProfile, (|
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
  photos: IPhotoPlaceholder[]
  password: string;
  repassword: string;
}

export type ICreateUser = Pick<IGetBasicUserProfile, (
  'uid' |
  'email' |
  'username' |
  'name' |
  'birthday'
)>

export type IUpdateUser = Partial<Omit<IGetDetailedUserProfile, (
  'outgoingFriendships' | 'incomingFriendships' | 'likedEvents' | 'id'
)>>

export interface IGetPaginatedUsersWhoLikedSameEvent extends
  IPaginated<IUsersWhoLikedSameEvent> { }

export interface IUsersWhoLikedSameEvent {
  id: number;
  createdAt: string;
  updatedAt: string;
  eventId: number;
  userId: number;
  user: IGetBasicUserProfile;
}

type IEvent = Pick<ILikeableEvent, ('photos' | 'name')>

export interface IGetBasicUserProfile extends
  Pick<IGetDetailedUserProfile, (
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

export interface IGetPaginatedUsers extends
  IPaginated<Omit<IGetBasicUserProfile, 'outgoingFriendships' | 'incomingFriendships'>> { }

export interface IGetDetailedUserProfile {
  id: number;
  uid: string;
  photos: IPhoto[];
  username: string;
  email: string;
  name: string
  biography?: string;
  phone?: string;
  birthday?: string;
  occupation?: string;
  currentLocation?: string;
  homeTown?: string;
  languages?: string[];
  likedEvents?: LikedEvent[];

  height?: number;
  weight?: number;
  interests?: EventCategory[];
  favoriteSports?: string[];
  music?: string[];
  educationLevel?: Education;
  lookingFor?: LookingFor;
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
  activateNotifications?: boolean;
  // sharedEvents: sharedEvent[];
}

export interface IGetTargetUser extends IGetDetailedUserProfile {
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
  event: IEvent;
}
