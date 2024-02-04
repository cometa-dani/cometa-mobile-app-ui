/* eslint-disable no-unused-vars */
import { Location } from './Localization';
import { Organization } from './Organization';
import { Photo } from './Photo';


export enum EventCategory {
  RESTAURANT,
  BAR,
  CLUB,
  CAFE,
  CONCERT,
  FESTIVAL,
  THEATRE,
  MUSEUM,
  EXHIBITION,
  PARK,
  BRUNCH,
  SHOWS,
  SPORTS,
  GALLERY,
  PARTY,
  CINEMA,
  CONFERENCE,
  FOOD_AND_DRINK,
  SEMINAR,
  WORKSHOP,
  EDUCATIONAL,
  CULTURAL
}

// type MediaType = 'IMAGE' | 'VIDEO'

export interface CreateEventLike {
  id: number,
  eventId: number,
  userId: number
}

export interface MatchedEvents {
  event: GetBasicEvent;
}

export interface GetBasicEvent {
  id: number;
  createdAt: string;
  updatedAt: string;
  date: string;
  name: string;
  description: string;
  photos: Array<Photo>;
  // mediaUrl: string;
  // mediaType: MediaType;
  locationId: number;
  organizationId: number;
  categories: EventCategory[];
}

export interface GetLatestEventsWithPagination {
  events: LikedEvent[];
  totalEvents: number;
  nextCursor: number;
  eventsPerPage: number;
}

export interface LikedEvent {
  id: number;
  createdAt: string;
  updatedAt: string;
  date: string;
  name: string;
  description: string;
  photos: Array<Photo>;
  // mediaUrl: string;
  // mediaType: MediaType;
  locationId: number;
  organizationId: number;
  categories: EventCategory[];
  organization: Organization;
  location: Location;
  likes: Array<Like>
  _count: Count;
  isLiked: boolean;
}

export interface Count {
  likes: number;
  shares: number
}

interface Like {
  id: number;
  createdAt: string;
  updatedAt: string;
  eventId: number;
  userId: number;
}
