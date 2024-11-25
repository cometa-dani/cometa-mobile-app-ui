/* eslint-disable no-unused-vars */
import { EventLike } from './EventLike';
import { Location } from './Localization';
import { Organization } from './Organization';
import { IPhoto } from './Photo';
import { IPaginated } from './utils/Paginated';


export enum EventCategory {
  RESTAURANT = 'Restaurant',
  BAR = 'Bar',
  CLUB = 'Club',
  CAFE = 'Cafe',
  CONCERT = 'Concert',
  FESTIVAL = 'Festival',
  THEATRE = 'Theatre',
  MUSEUM = 'Museum',
  EXHIBITION = 'Exhibition',
  PARK = 'Park',
  SHOWS = 'Shows',
  SPORTS = 'Sports',
  GALLERY = 'Gallery',
  PARTY = 'Party',
  CINEMA = 'Cinema',
  EDUCATIONAL = 'Educational',
  CULTURAL = 'Cultural',
  BRUNCH = 'Brunch',
}

export type CreateEventLike =
  Pick<EventLike, (
    'id' |
    'eventId' |
    'userId'
  )>


export interface MatchedEvents {
  event: ILikeableEvent
}

export interface IGetLatestPaginatedEvents extends IPaginated<ILikeableEvent> { }

export interface ILikeableEvent {
  id: number;
  createdAt: string;
  updatedAt: string;
  date: string;
  name: string;
  description: string;
  categories: EventCategory[];
  locationId?: number;
  organizationId?: number;
  organization?: Organization;
  location?: Location;

  photos: Array<IPhoto>; // 1 or 3
  likes?: EventLike[]
  _count: ICount;
  isLiked: boolean;
}

export interface ICount {
  likes: number;
  shares: number
}
