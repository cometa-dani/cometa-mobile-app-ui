/* eslint-disable no-unused-vars */
import { EventLike } from './EventLike';
import { Location } from './Localization';
import { Organization } from './Organization';
import { Photo } from './Photo';


export enum EventCategory {
  RESTAURANT,
  BAR,
  CLUB,
  CAFE,
  CONCERT,
  FESTIVAL,
  THEATRE,
  MUSEUM,
  EXHIBITION,
  PARK,
  BRUNCH,
  SHOWS,
  SPORTS,
  GALLERY,
  PARTY,
  CINEMA,
  CONFERENCE,
  FOOD_AND_DRINK,
  SEMINAR,
  WORKSHOP,
  EDUCATIONAL,
  CULTURAL
}

export type CreateEventLike =
  Pick<EventLike, (
    'id' |
    'eventId' |
    'userId'
  )>


export interface MatchedEvents {
  event: LikeableEvent
  // Pick<LikableEvent, (
  //   'id' |
  //   'createdAt' |
  //   'updatedAt' |
  //   'date' |
  //   'name' |
  //   'description' |
  //   'photos' |
  //   'locationId' |
  //   'organizationId' |
  //   'categories'
  // )>;
}

export interface GetAllLatestEventsWithPagination {
  events: LikeableEvent[];
  totalEvents: number;
  nextCursor: number;
  eventsPerPage: number;
}

export interface LikeableEvent {
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

  photos: Array<Photo>; // 1 or 3
  likes?: EventLike[]
  _count: Count;
  isLiked: boolean;
}

export interface Count {
  likes: number;
  shares: number
}
