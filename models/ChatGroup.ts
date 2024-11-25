import { IPhoto } from './Photo';
import { IGetBasicUserProfile } from './User';

export interface ChatGroup {
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

export interface GetChatGroupById extends ChatGroup {
  members: {
    [key: string]: IGetBasicUserProfile
  }
}
