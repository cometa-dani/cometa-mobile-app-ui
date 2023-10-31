export interface UserRes {
  id: number;
  uid: string;
  avatar: string;
  photos: Photo[];
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface Photo {
  url: string,
  uuid: string
}


export interface UsersWhoLikedSameEventHttpRes {
  usersWhoLikedSameEvent: UsersWhoLikedSameEvent[];
  currentPage: number;
  totalUsers: number;
  usersPerPage: number;
}

export interface UsersWhoLikedSameEvent {
  id: number;
  avatar: string;
  photos: object[];
  username: string;
  email: string;
  phone: null;
  uid: string;
  incomingFriendships: object[];
  outgoingFriendships: object[];
  _count?: Count;
}

export interface Count {
  likedEvents: number;
  matches: number;
  outgoingFriendships: number;
  incomingFriendships: number;
  outgoingNotification: number;
  incomingNotification: number;
}
