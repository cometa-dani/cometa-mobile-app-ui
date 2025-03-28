/* eslint-disable no-unused-vars */
import { Location } from './Localization';
import { Organization } from './Organization';


export enum EventCategory {
  PARTY,
  CONCERT,
  FOOTBALL,
  MUSEUM,
  GALLERY,
  COMEDY
}

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
  mediaUrl: string;
  mediaType: string;
  locationId: number;
  organizationId: number;
  category: EventCategory;
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
  mediaUrl: string;
  mediaType: string;
  locationId: number;
  organizationId: number;
  category: string;
  organization: Organization;
  location: Location;
  likes: Array<{ userId: number }>
  _count: Count;
  isLiked: boolean;
}

export interface Count {
  likes: number;
}
