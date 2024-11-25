import { IPhoto } from './Photo';
import { IGetBasicUserProfile } from './User';

export interface IChatGroup {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description?: string;
  photo?: IPhoto;
  chatGroupPhotoId?: number;
  // members: GetBasicUserProfile[];
  admin: IGetBasicUserProfile;
  adminId: number;
}

export interface IGetChatGroupById extends IChatGroup {
  members: {
    [key: string]: IGetBasicUserProfile
  }
}
