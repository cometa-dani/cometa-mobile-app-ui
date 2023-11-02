import { Location } from './Localization';
import { Organization } from './Organization';


export interface CreateLikedEvent {
  id: number,
  eventId: number,
  userId: number
}

export interface CreateEventRes {
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
}

export interface GetLatestEvents {
  events: LikedEvent[];
  totalEvents: number;
  nextCursor: number;
  eventsPerPage: number;
}

interface LikedEvent {
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
