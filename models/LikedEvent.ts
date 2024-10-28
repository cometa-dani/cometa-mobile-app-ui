import { LikeableEvent } from './Event';

export interface GetLikedEventsForBucketListWithPagination {
  items: LikeableEvent[];
  totalItems: number;
  nextCursor: number;
  hasNextCursor: boolean;
  itemsPerPage: number;
}
