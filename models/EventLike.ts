import { UserRes } from './User';


export interface EventLike {
  id: number;
  eventId: number;
  userId: number;
  user: UserRes;
}
