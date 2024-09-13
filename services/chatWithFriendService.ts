import { increment, push, ref, set, update } from 'firebase/database';
import { GetBasicUserProfile } from '../models/User';
import { realtimeDB } from '../config/firebase/firebase';
import { UserMessagesData } from '../store/slices/messagesSlices';


export type UserData = Pick<GetBasicUserProfile, ('uid' | 'name' | 'photos')>;


class ChatWithFriendService {

  writeMessage(chatuuid: string, messagePayload: object, loggedInUser: UserData, targetUser: UserData): Promise<[void, void]> {
    return (
      Promise.all([
        this._writeChatHistory(chatuuid, messagePayload, loggedInUser, targetUser),
        this._writeLatestMessages(chatuuid, messagePayload, loggedInUser, targetUser)
      ])
    );
  }


  private async _writeChatHistory(chatuuid: string, messagePayload: object, loggedInUser: UserData, targetUser: UserData): Promise<void> {
    const chatsRootRef = ref(realtimeDB, `chats/${chatuuid}`);
    const chatsRefUser1 = ref(realtimeDB, `chats/${chatuuid}/${loggedInUser.uid}`);
    const newMessageKey1 = (await push(chatsRefUser1)).key;

    const chatPayload = {
      [`/${loggedInUser.uid}/${newMessageKey1}`]: messagePayload,
      [`/${targetUser.uid}/${newMessageKey1}`]: messagePayload
    };

    return update(chatsRootRef, chatPayload);
  }


  private _writeLatestMessages(chatuuid: string, messagePayload: object, loggedInUser: UserData, targetUser: UserData): Promise<void> {
    const latestMessagesRef = ref(realtimeDB, 'latestMessages');

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

    return update(latestMessagesRef, latestMessagesPayload);
  }


  setMessageAsViewed(
    chatuuid: string,
    loggedInUserUUID: string,
    targetUser: UserData,
    lastMessage: UserMessagesData,
    latestMessages: UserMessagesData[]
  ): Promise<void> {
    const chatsRootRef = ref(realtimeDB);

    const lastMessageCounter = {
      [`latestMessages/${loggedInUserUUID}/${chatuuid}`]: {
        ...lastMessage,
        sent: true,
        received: true,
        newMessagesCount: 0,
        user: {
          _id: targetUser?.uid,
          name: targetUser?.name,
          avatar: targetUser?.photos[0]?.url,
        },
        updatedAt: new Date().toString()
      }
    };

    const viewedChatMessages = latestMessages.reduce((prev, currMsg) => ({
      ...prev,
      [`chats/${chatuuid}/${loggedInUserUUID}/${currMsg.messageUUID}`]: { ...currMsg, sent: true, received: true },
      [`chats/${chatuuid}/${targetUser.uid}/${currMsg.messageUUID}`]: { ...currMsg, sent: true, received: true }
    }),
      {}
    );

    const chatMessagesPayload = {
      ...viewedChatMessages,
      ...lastMessageCounter
    };

    return update(chatsRootRef, chatMessagesPayload);
  }


  deleteLatestMessage(loggedInUserUUID: string | number, chatuuid: string): Promise<void> {
    const latestMessageRef = ref(realtimeDB, `latestMessages/${loggedInUserUUID}/${chatuuid}`);
    return set(latestMessageRef, null);
  }


  deleteLoggedInUserChatHistory(loggedInUserUUID: string | number, chatuuid: string): Promise<void> {
    const chatRef = ref(realtimeDB, `chats/${chatuuid}/${loggedInUserUUID}`);
    return set(chatRef, null);
  }


  deleteBothUsersChatHistory(chatuuid: string, loggedInUserUUID: string | number, targetUserUUID: string | number): Promise<void> {
    const chatRef = ref(realtimeDB);

    const bothUsers = {
      [`latestMessages/${loggedInUserUUID}/${chatuuid}`]: null,
      [`latestMessages/${targetUserUUID}/${chatuuid}`]: null,
      [`chats/${chatuuid}`]: null,
    };

    return update(chatRef, bothUsers);
  }
}


export default new ChatWithFriendService();
