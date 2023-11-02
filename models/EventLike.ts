import { Location } from './Localization';
import { UserClientState } from './User';


export interface EventLike {
  id: number;
  eventId: number;
  userId: number;
  user: UserClientState;
}

export interface GetLikedEventByID {
  id: number;
  createdAt: string;
  updatedAt: string;
  date: string;
  name: string;
  description: string;
  mediaUrl: string;
  mediaType: string;
  locationId: number;
  organizationId: number;
  category: string;
  location: Location;
}
