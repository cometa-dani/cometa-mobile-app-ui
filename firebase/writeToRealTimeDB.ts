import { push, ref, set, update, increment } from 'firebase/database';
import { realtimeDB } from './firebase';
import { GetBasicUserProfile } from '../models/User';


type UserData = Pick<GetBasicUserProfile, ('uid' | 'name' | 'photos')>;


export async function writeToRealTimeDB(chatuuid: string, messagePayload: object, loggedInUser: UserData, targetUser: UserData) {
  const chatsRef = ref(realtimeDB, `chats/${chatuuid}`);
  const latestMessageRef = ref(realtimeDB, 'latestMessages');
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


type ChatGroup = {
  uuid: string;
  name: string;
  photo: string;
};

export async function writeToChatGroup(messagePayload: object, loggedInUserUUID: string, targetUsers: (string | number)[], chatGroup: ChatGroup) {
  const chatsRef = ref(realtimeDB, `chats/${chatGroup?.uuid}`);
  const latestMessageRef = ref(realtimeDB, 'latestMessages');
  const chatListRef = push(chatsRef);

  const toTargetUsersLatestMessagePayload = {
    ...messagePayload,
    isChatGroup: true,
    user: {
      _id: chatGroup.uuid,
      name: chatGroup?.name,
      avatar: chatGroup?.photo ?? '', // chat group photo
    },
    newMessagesCount: increment(1)// sent messages to target user
  };

  const fromLoggedInUserOwnLatestMessagePayload = {
    ...messagePayload,
    isChatGroup: true,
    user: {
      _id: chatGroup?.uuid,  // chat group UUID
      name: chatGroup?.name, // chat group name
      avatar: chatGroup?.photo ?? '', // chat group photo
    },
    newMessagesCount: 0  // your own written messages
  };

  const allTargetUsersMessages =
    targetUsers
      .reduce((prev, targetUserUUID) => ({
        ...prev,
        [`/${targetUserUUID}/${chatGroup.uuid}`]: toTargetUsersLatestMessagePayload
      }),
        new Object()
      );

  // update different locations in the database and keeps them in sync
  const latestMessagesPayload = {
    [`/${loggedInUserUUID}/${chatGroup.uuid}`]: fromLoggedInUserOwnLatestMessagePayload,
    ...allTargetUsersMessages
    // user1...
    // user2...
  };


  return (
    await Promise.all([
      set(chatListRef, messagePayload),
      update(latestMessageRef, latestMessagesPayload) // overwrite the latest message if present
    ])
  );
}
