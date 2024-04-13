import { increment, push, ref, set, update } from 'firebase/database';
import { GetBasicUserProfile } from '../models/User';
import { realtimeDB } from '../firebase/firebase';
import { UserMessagesData } from '../store/slices/messagesSlices';


export type UserData = Pick<GetBasicUserProfile, ('uid' | 'name' | 'photos')>;


class ChatWithFriendService {

  async writeMessage(chatuuid: string, messagePayload: object, loggedInUser: UserData, targetUser: UserData) {
    const chatsRef = ref(realtimeDB, `chats/${chatuuid}`);
    const latestMessagesRef = ref(realtimeDB, 'latestMessages');
    const chatListRef = push(chatsRef);

    const toTargetUserLatestMessagePayload = {
      ...messagePayload,
      isChatGroup: false,
      user: {
        _id: loggedInUser?.uid,
        name: loggedInUser?.name,
        avatar: loggedInUser?.photos[0]?.url,
      },
      newMessagesCount: increment(1) // sent messages to target user
    };
    const fromLoggedInUserOwnLatestMessagePayload = {
      ...messagePayload,
      isChatGroup: false,
      user: {
        _id: targetUser?.uid,
        name: targetUser?.name,
        avatar: targetUser?.photos[0]?.url,
      },
      newMessagesCount: 0  // your own written messages
    };

    // update different locations in the database and keeps them in sync
    const latestMessagesPayload = {
      [`/${loggedInUser.uid}/${chatuuid}`]: fromLoggedInUserOwnLatestMessagePayload,
      [`/${targetUser.uid}/${chatuuid}`]: toTargetUserLatestMessagePayload
    };

    return (
      await Promise.all([
        set(chatListRef, messagePayload),
        update(latestMessagesRef, latestMessagesPayload) // overwrite the latest message if present
      ])
    );
  }


  async markLastMessageAsSeen(loggedInUserUUID: string | number, prevMessage: UserMessagesData) {
    const latestMessageRef = ref(realtimeDB, `latestMessages/${loggedInUserUUID}/${prevMessage.chatUUID}`);
    const messagePayload = {
      ...prevMessage,
      newMessagesCount: 0,
      updatedAt: new Date().toString(),
    };

    return await set(latestMessageRef, messagePayload);
  }


  async deleteLatestMessage(loggedInUserUUID: string | number, chatuuid: string) {
    const latestMessageRef = ref(realtimeDB, `latestMessages/${loggedInUserUUID}/${chatuuid}`);
    return await set(latestMessageRef, null);
  }


  async deleteLocalMessages() { }
}


export default new ChatWithFriendService();
