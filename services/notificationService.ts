import { ref, set, update, get, limitToLast, query } from 'firebase/database';
import { realtimeDB } from '../config/firebase/firebase';


class NotificationService {
  async sentNotificationToTargetUser(notificationPayload: object, targetUserUUID: string, msgKey: string) {
    const notificationsRef = ref(realtimeDB, `notifications/${targetUserUUID}/${msgKey}`);
    return set(notificationsRef, notificationPayload);
  }

  async setNotificationAsSeen(loggedInUserUUID: string, msgKey: string) {
    const notificationRef = ref(realtimeDB, `notifications/${loggedInUserUUID}/${msgKey}/user`);
    return update(notificationRef, { isSeen: true });
  }

  async deleteNotification(loggedInUserUUID: string, msgKey: string) {
    const notificationRef = ref(realtimeDB, `notifications/${loggedInUserUUID}/${msgKey}`);
    return set(notificationRef, null);
  }

  async deleteLastNotification(loggedInUserUUID: string) {
    const lastItem = query(ref(realtimeDB, `notifications/${loggedInUserUUID}`), limitToLast(1));
    const { key } = await get(lastItem);
    const notificationRef = ref(realtimeDB, `notifications/${loggedInUserUUID}/${key}`);
    return set(notificationRef, null);
  }

  async deleteAllNotifications(loggedInUserUUID: string) {
    const notificationRef = ref(realtimeDB, `notifications/${loggedInUserUUID}`);
    return set(notificationRef, null);
  }
}


export default new NotificationService();
