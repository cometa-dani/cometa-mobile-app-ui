import { LikeableEvent } from './Event';

export interface GetLikedEventsForBucketListWithPagination {
  events: LikeableEvent[];
  totalEvents: number;
  nextCursor: number;
  eventsPerPage: number;
}
