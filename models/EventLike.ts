import { LikableEvent } from './Event';
import { GetBasicUserProfile } from './User';


export interface EventLike {
  id: number;
  eventId: number;
  userId: number;
  user: Pick<GetBasicUserProfile, 'photos'>;
}

export type GetEventByID =
  Pick<LikableEvent, (
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
