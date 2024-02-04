/* eslint-disable no-unused-vars */
import { ImagePickerAsset } from 'expo-image-picker';
import { EventCategory } from './Event';
import { Friendship, Status } from './Friendship';
import { Photo } from './Photo';


// used in zustand store for global CLIENT STATE
export interface UserClientState extends GetBasicUserProfile {
  password: string;
  imageRef: ImagePickerAsset;
}

// export interface Photo {
//   url: string,
//   uuid: string
// }

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

// enum LookingFor {
//   MEET_NEW_PEOPLE,
//   DISCOVER_NEW_EVENTS
// }

// enum Education {
//   SECONDARY,
//   UNIVERSITY,
//   POST_GRADUATE,
//   NONE
// }


// enum MediaType {
//   IMAGE,
//   VIDEO
// }

enum FriendshipStatus {
  PENDING,
  ACCEPTED,
  BLOCKED,
}

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

// used in react query for SERVER STATE
export interface GetBasicUserProfile {
  id: number;
  // avatar: string;
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
  educationLevel?: Education

  uid: string;
  outgoingFriendships: Friendship[];
  incomingFriendships: Friendship[];
}


export interface GetDetailedUserProfile {
  id: number;
  // avatar: string;
  photos: Photo[];
  maxNumPhotos: number;
  username: string;
  name: string
  biography: string;
  email: string;
  phone?: string;

  //  currentLocation String ? @map("current_location")
  // homeTown        String ? @map("home_town")
  // languages       String[]    @default ([])
  // height          Int ?
  // weight          Int ?
  //   favoriteSports  String[]    @default ([]) @map("favorite_sports")
  // music           String[]    @default ([])

  // lookingFor         LookingFor ? @map("looking_for")
  // occupation         String ?
  // educationLevel     Education ? @map("education_level")
  // relationshipStatus RelationshipStatus ? @map("relationship_status")
  // pets               String[]            @default ([])
  // smoking            Boolean ?
  // drinking           Boolean ?
  //   religion           Religion ?
  //     ethnicity          Ethnicity ?
  //       children           Boolean ?
  //         company            String ?
  //           verified           Boolean ? @default (false)
  // gender             Gender ?
  // diet               Diet ?
  //   exerciseFrequency  ExerciseFrequency ? @map("exercise_frequency")

  // address?: string;
  currentLocation?: string;
  homeTown?: string;
  languages?: string[];
  height?: number;
  weight?: number;
  favoriteSports?: string[];
  music?: string[];
  lookingFor?: LookingFor;
  occupation?: string;
  // education?: Education
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
