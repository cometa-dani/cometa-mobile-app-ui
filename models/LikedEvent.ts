import { EventCategory } from './Event';
import { EventLike } from './EventLike';
import { Photo } from './Photo';

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
  photos: Photo[]
  // mediaUrl: string;
  // mediaType: string;
  locationId: number;
  organizationId: number;
  categories: EventCategory[];
  // matches: object[];
  likes: EventLike[];
}
