import { push, ref, set, update, increment } from 'firebase/database';
import { realtimeDB } from '../firebase/firebase';
import { GetBasicUserProfile } from '../models/User';


export type UserData = Pick<GetBasicUserProfile, ('uid' | 'name' | 'photos')>;


type ChatGroup = {
  uuid: string;
  name: string;
  photo: string;
};


class ChatWithGroupService {

  async addMembers(chatGroupUUID: string, membersUUID: (string | number)[]) {
    const chatGroupRef = ref(realtimeDB, `chatGroups/${chatGroupUUID}/members`);
    return await update(chatGroupRef, membersUUID);
  }


  async writeMessage(messagePayload: object, loggedInUserUUID: string, targetUsersAsMembers: (string | number)[], chatGroup: ChatGroup) {
    const chatsRef = ref(realtimeDB, `chatGroups/${chatGroup?.uuid}/messages`);
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
      targetUsersAsMembers
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


  async deleteLatestMessage(loggedInUserUUID: string | number, chatuuid: string) {
    const latestMessageRef = ref(realtimeDB, `latestGroupMessages/${loggedInUserUUID}/${chatuuid}`);
    return await set(latestMessageRef, null);
  }
}


export default new ChatWithGroupService();
