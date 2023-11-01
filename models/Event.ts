export interface EventsListRes {
  events: Event[];
  totalEvents: number;
  cursor: number;
  eventsPerPage: number;
}

export interface Event {
  id: number;
  createdAt: string;
  updatedAt: string;
  date: string;
  name: string;
  description: string;
  mediaUrl: string;
  mediaType: string;
  category: string;
  likes: object[];
  matches: object[];

  isLiked: boolean;
  locationId: number;
  location: Location;
  organizationId: number;
  organization: Organization;
}

export interface LikeEvent {
  id: number,
  eventId: number,
  userId: number
}

export interface Location {
  id: number;
  createdAt: string;
  updatedAt: string;
  organizationId: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  mediaUrls: string[];
}

export interface Organization {
  id: number;
  createdAt: string;
  updatedAt: string;
  mediaUrl: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  accessToken: string;
  description: string;
}

export interface CreateEventRes {
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
}
