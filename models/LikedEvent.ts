import { LikeableEvent } from './Event';

export interface GetAllLikedEventsWithPagination {
  events: LikeableEvent[];
  totalEvents: number;
  currentPage: number;
  eventsPerPage: number;
}
