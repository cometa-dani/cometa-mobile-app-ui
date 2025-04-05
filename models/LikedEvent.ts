import { ILikedEvent } from './Event';
import { IPaginated } from './utils/Paginated';

export interface IGetPaginatedLikedEventsBucketList
  extends IPaginated<ILikedEvent> { }
