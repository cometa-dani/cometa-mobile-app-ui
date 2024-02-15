import { EventCategory } from './Event';
import { Location } from './Localization';
import { Photo } from './Photo';
import { GetBasicUserProfile } from './User';


export interface EventLike {
  id: number;
  eventId: number;
  userId: number;
  user: Pick<GetBasicUserProfile, 'photos'>;
}

export interface GetEventByID {
  id: number;
  createdAt: string;
  updatedAt: string;
  date: string;
  name: string;
  description: string;
  photos: Photo[];
  locationId: number;
  organizationId: number;
  categories: EventCategory[];
  location: Location;
}
