import { push, ref, set, update } from 'firebase/database';
import { realtimeDB } from './firebase';
import { GetBasicUserProfile } from '../models/User';


type UserData = Pick<GetBasicUserProfile, ('uid' | 'name' | 'photos')>;

export async function writeToRealTimeDB(chatuuid: string, messagePayload: object, loggedInUser: UserData, targetUser: UserData) {
  const chatsRef = ref(realtimeDB, `chats/${chatuuid}`);
  const chatListRef = push(chatsRef);

  const latestMessageRef = ref(realtimeDB, 'latestMessages');
  const loggedInUserLatestMessagePayload = {
    ...messagePayload,
    user: {
      _id: loggedInUser?.uid,
      name: loggedInUser?.name,
      avatar: loggedInUser?.photos[0]?.url
    }
  };
  const targetUserLatestMessagePayload = {
    ...messagePayload,
    user: {
      _id: targetUser?.uid,
      name: targetUser?.name,
      avatar: targetUser?.photos[0]?.url
    }
  };

  // update different locations in the database and keeps them in sync
  const latestMessagesPayload = {
    [`/${loggedInUser.uid}/${chatuuid}`]: targetUserLatestMessagePayload,
    [`/${targetUser.uid}/${chatuuid}`]: loggedInUserLatestMessagePayload
  };

  return (
    await Promise.all([
      set(chatListRef, messagePayload),
      update(latestMessageRef, latestMessagesPayload) // overwrite the latest message if present
    ])
  );
}
