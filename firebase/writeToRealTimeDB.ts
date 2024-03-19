import { push, ref, set, update } from 'firebase/database';
import { realtimeDB } from './firebase';
import { GetBasicUserProfile } from '../models/User';


type UserData = Pick<GetBasicUserProfile, ('uid' | 'name' | 'photos')>;

export async function writeToRealTimeDB(chatuuid: string, messagePayload: object, loggedInUser: UserData, targetUserUUID: string) {
  const chatsRef = ref(realtimeDB, `chats/${chatuuid}`);
  const chatListRef = push(chatsRef);

  const latestMessageRef = ref(realtimeDB, 'latestMessages');
  const latestMessagePayload = {
    ...messagePayload,
    user: {
      _id: loggedInUser?.uid,
      name: loggedInUser?.name,
      avatar: loggedInUser?.photos[0]?.url
    }
  };

  // update different locations in the database and keeps them in sync
  const latestMessageUpdates = {
    [`/${loggedInUser.uid}/${chatuuid}`]: latestMessagePayload,
    [`/${targetUserUUID}/${chatuuid}`]: latestMessagePayload
  };

  return (
    await Promise.all([
      set(chatListRef, messagePayload),
      update(latestMessageRef, latestMessageUpdates) // overwrite the latest message if present
    ])
  );
}
