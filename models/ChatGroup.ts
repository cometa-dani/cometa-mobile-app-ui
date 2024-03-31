// id        String @id @default (dbgenerated("gen_random_uuid()")) @db.Uuid // TODO:   Sintrg @id @default(uuid())
//   createdAt DateTime @default (now()) @map("created_at")
//   updatedAt DateTime @updatedAt @map("updated_at")

import { Photo } from './Photo';
import { GetBasicUserProfile } from './User';

//   name             String
//   description      String ?
//   photo            ChatGroupPhoto ? @relation(fields: [chatGroupPhotoId], references: [id])
//   chatGroupPhotoId Int ? @unique @map("chat_group_photo_id")
//   // uuid             String          @unique // remove in the future for @id with uuid()
//   members          User[]          @relation("ChatGroupMember")
//   admin            User @relation("ChatGroupAdmin", fields: [adminId], references: [id])
//   adminId          Int


export interface ChatGroup {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description?: string;
  photo?: Photo;
  chatGroupPhotoId?: number;
  // members: GetBasicUserProfile[];
  admin: GetBasicUserProfile;
  adminId: number;
}

export interface GetChatGroupById extends ChatGroup {
  members: {
    [key: string]: GetBasicUserProfile
  }
}
