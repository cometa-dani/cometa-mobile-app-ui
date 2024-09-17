import { ref, set, update } from 'firebase/database';
import { realtimeDB } from '../config/firebase/firebase';


class NotificationService {
  sentNotificationToTargetUser = async (notificationPayload: object, targetUserUUID: string, chatUUID: string) => {
    const notificationsRef = ref(realtimeDB, `notifications/${targetUserUUID}/${chatUUID}`);
    return await set(notificationsRef, notificationPayload);
  };

  setNotificationAsSeen = async (chatUUID: string, loggedInUserUUID: string) => {
    const notificationRef = ref(realtimeDB, `notifications/${loggedInUserUUID}/${chatUUID}/user`);
    return await update(notificationRef, { isSeen: true });
  };

  deleteNotification = async (chatUUID: string, loggedInUserUUID: string) => {
    const notificationRef = ref(realtimeDB, `notifications/${loggedInUserUUID}/${chatUUID}`);
    return await set(notificationRef, null);
  };

  deleteAllNotifications = async (loggedInUserUUID: string) => {
    const notificationRef = ref(realtimeDB, `notifications/${loggedInUserUUID}`);
    return await set(notificationRef, null);
  };
}


export default new NotificationService();
