import { EventLike } from './EventLike';

export interface GetAllLikedEventsWithPagination {
  events: LikedEvent[];
  totalEvents: number;
  currentPage: number;
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
  // matches: object[];
  likes: EventLike[];
}
