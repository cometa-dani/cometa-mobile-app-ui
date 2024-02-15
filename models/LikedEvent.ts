import { LikableEvent } from './Event';

export interface GetAllLikedEventsWithPagination {
  events: LikableEvent[];
  totalEvents: number;
  currentPage: number;
  eventsPerPage: number;
}
