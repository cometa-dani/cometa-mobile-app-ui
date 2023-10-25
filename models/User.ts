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
