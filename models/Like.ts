import { UserRes } from './User';

export interface Like {
  id: number;
  eventId: number;
  userId: number;
  user: UserRes;
}
