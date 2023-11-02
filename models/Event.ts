// export interface EventsListRes {
//   events: Event[];
//   totalEvents: number;
//   nextCursor: number;
//   eventsPerPage: number;
// }

// export interface Event {
//   id: number;
//   createdAt: string;
//   updatedAt: string;
//   date: string;
//   name: string;
//   description: string;
//   mediaUrl: string;
//   mediaType: string;
//   category: string;
//   likes: object[];
//   matches: object[];

//   isLiked: boolean;
//   locationId: number;
//   location: Location;
//   organizationId: number;
//   organization: Organization;
// }

export interface LikeEvent {
  id: number,
  eventId: number,
  userId: number
}

// export interface Location {
//   id: number;
//   createdAt: string;
//   updatedAt: string;
//   organizationId: number;
//   name: string;
//   description: string;
//   latitude: number;
//   longitude: number;
//   mediaUrls: string[];
// }

// export interface Organization {
//   id: number;
//   createdAt: string;
//   updatedAt: string;
//   mediaUrl: string;
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
//   accessToken: string;
//   description: string;
// }

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

// Generated by https://quicktype.io

export interface GetLatestEvents {
  events: Event[];
  totalEvents: number;
  nextCursor: number;
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
  locationId: number;
  organizationId: number;
  category: string;
  organization: Organization;
  location: Location;
  _count: Count;
  isLiked: boolean;
}

export interface Count {
  likes: number;
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
