import { INotification } from '@/models/Notification';
import { supabase } from '@/supabase/config';


class NotificationService {
  async sentNotificationToTargetUser(notificationPayload: object, targetUserUUID: string, msgKey: string) {
    // const notificationsRef = ref(realtimeDB, `notifications/${targetUserUUID}/${msgKey}`);
    // return set(notificationsRef, notificationPayload);
  }

  async setNotificationAsSeen(loggedInUserUUID: string, msgKey: string) {
    // const notificationRef = ref(realtimeDB, `notifications/${loggedInUserUUID}/${msgKey}/user`);
    // return update(notificationRef, { isSeen: true });
  }

  async deleteNotification(loggedInUserUUID: string, msgKey: string) {
    // const notificationRef = ref(realtimeDB, `notifications/${loggedInUserUUID}/${msgKey}`);
    // return set(notificationRef, null);
  }

  async deleteLastNotification(loggedInUserUUID: string) {
    // const lastItem = query(ref(realtimeDB, `notifications/${loggedInUserUUID}`), limitToLast(1));
    // const { key } = await get(lastItem);
    // const notificationRef = ref(realtimeDB, `notifications/${loggedInUserUUID}/${key}`);
    // return set(notificationRef, null);
  }

  async deleteAllNotifications(loggedInUserUUID: string) {
    // const notificationRef = ref(realtimeDB, `notifications/${loggedInUserUUID}`);
    // return set(notificationRef, null);
  }

  async getLatestByUser(userId: number, limit: number): Promise<INotification[]> {
    const { data, error } = await supabase
      .from('Friendship')
      .select(`
        id,
        "createdAt":created_at,
        "updatedAt":updated_at,
        "senderId":sender_id,
        "receiverId":receiver_id,
        status,
        sender:User!sender_id(
          id,
          name,
          username,
          photos:UserPhoto!user_id(
            id,
            url,
            placeholder,
            order
          )
        ),
        receiver:User!receiver_id(
          id,
          name,
          username,
          photos:UserPhoto!user_id(
            id,
            url,
            placeholder,
            order
          )
        )
      `)
      // .not('last_message_at', 'is', null)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('updated_at', { ascending: false })
      .limit(limit)
      .returns<INotification[]>();

    if (error) throw error;

    return data.map<INotification>(friendship => ({
      ...friendship,
      friend: {
        ...(friendship.senderId === userId
          ? friendship.receiver
          : friendship.sender),
        photos: friendship.senderId === userId
          ? friendship.receiver.photos
          : friendship.sender.photos
      },
    }));
  }
}


export default new NotificationService();
