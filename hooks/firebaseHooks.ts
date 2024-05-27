import { useEffect } from 'react';
import { ref, onValue, DataSnapshot, IteratedDataSnapshot } from 'firebase/database';
import { realtimeDB } from '../config/firebase/firebase'; // Adjust the import according to your project structure
import { UserMessagesData } from '../store/slices/messagesSlices';
import { INotificationData } from '../store/slices/notificationSlice';


const processMessagesSnapshot = (snapshot: DataSnapshot): UserMessagesData[] => {
  const messages: UserMessagesData[] = [];
  snapshot.forEach((child: IteratedDataSnapshot) => {
    const data = {
      ...child.val(),
      chatUUID: child.key,
      text: child.val()?.text ?? '',
      newMessagesCount: child.val()?.newMessagesCount ?? 0,
      isChatGroup: child.val()?.isChatGroup ?? false,
      createdAt: child.val()?.createdAt ?? 0,
    } as UserMessagesData;
    messages.push(data);
  });
  return messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};


const processNotificationsSnapshot = (snapshot: DataSnapshot): INotificationData[] => {
  const notifications: INotificationData[] = [];
  snapshot.forEach((child: IteratedDataSnapshot) => {
    const data = {
      ...child.val(),
      chatUUID: child.key,
    } as INotificationData;
    notifications.push(data);
  });
  return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};


export const useUserMessagesAndNotifications =
  (
    loggedInUserUUID: string | null,
    setFriendsLatestMessagesList: (messages: UserMessagesData[]) => void,

    setNotificationsList: (notifications: INotificationData[]) => void
  ) => {

    useEffect(() => {
      if (!loggedInUserUUID) return;

      const latestMessageRef = ref(realtimeDB, `latestMessages/${loggedInUserUUID}`);
      const notificationsRef = ref(realtimeDB, `notifications/${loggedInUserUUID}`);

      const unsubscribeMessages = onValue(latestMessageRef, (snapshot) => {
        const sortedMessages = processMessagesSnapshot(snapshot);
        setFriendsLatestMessagesList(sortedMessages);
      }, (error) => {
        return null;
      });

      const unsubscribeNotifications = onValue(notificationsRef, (snapshot) => {
        const sortedNotifications = processNotificationsSnapshot(snapshot);
        setNotificationsList(sortedNotifications);
      }, (error) => {
        return null;
      });

      return () => {
        unsubscribeMessages && unsubscribeMessages();
        unsubscribeNotifications && unsubscribeNotifications();
      };
    }, [loggedInUserUUID, setFriendsLatestMessagesList, setNotificationsList]);
  };
