import { push, ref, set, update, increment } from 'firebase/database';
import { realtimeDB } from './firebase';
import { GetBasicUserProfile } from '../models/User';


type UserData = Pick<GetBasicUserProfile, ('uid' | 'name' | 'photos')>;

export async function writeToRealTimeDB(chatuuid: string, messagePayload: object, loggedInUser: UserData, targetUser: UserData) {
  const chatsRef = ref(realtimeDB, `chats/${chatuuid}`);
  const latestMessageRef = ref(realtimeDB, 'latestMessages');
  const chatListRef = push(chatsRef);

  const targetUserLatestMessagePayload = {
    ...messagePayload,
    user: {
      _id: loggedInUser?.uid,
      name: loggedInUser?.name,
      avatar: loggedInUser?.photos[0]?.url,
    },
    newMessagesCount: increment(1) // sent messages to target user
  };
  const loggedInUserOwnLatestMessagePayload = {
    ...messagePayload,
    user: {
      _id: targetUser?.uid,
      name: targetUser?.name,
      avatar: targetUser?.photos[0]?.url,
    },
    newMessagesCount: 0  // your own written messages
  };

  // update different locations in the database and keeps them in sync
  const latestMessagesPayload = {
    [`/${loggedInUser.uid}/${chatuuid}`]: loggedInUserOwnLatestMessagePayload,
    [`/${targetUser.uid}/${chatuuid}`]: targetUserLatestMessagePayload
  };

  return (
    await Promise.all([
      set(chatListRef, messagePayload),
      update(latestMessageRef, latestMessagesPayload) // overwrite the latest message if present
    ])
  );
}

export const markLastMessageAsSeen = async (loggedInUserUUID: string | number, chatuuid: string, prevMessage: object) => {
  const latestMessageRef = ref(realtimeDB, `latestMessages/${loggedInUserUUID}/${chatuuid}`);
  const messagePayload = {
    ...prevMessage,
    newMessagesCount: 0,
    updatedAt: new Date().toString(),
  };

  return await set(latestMessageRef, messagePayload);
};
