export interface UserRes {
  id: number;
  avatar: string | null;
  photos: string[];
  username: string;
  email: string;
  phone: string;
  password: string;
  uid: string;
}
