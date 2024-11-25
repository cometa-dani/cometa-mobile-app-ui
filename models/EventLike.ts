import { ILikeableEvent } from './Event';
import { IGetBasicUserProfile } from './User';


export interface EventLike {
  id: number;
  eventId: number;
  userId: number;
  user: Pick<IGetBasicUserProfile, 'photos'>;
}

export type GetEventByID =
  Pick<ILikeableEvent, (
    'id' |
    'createdAt' |
    'updatedAt' |
    'date' |
    'name' |
    'description' |
    'photos' |
    'locationId' |
    'organizationId' |
    'categories' |
    'location'
  )>
