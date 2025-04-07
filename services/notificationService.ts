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

  async sendFriendRequestNotification(targetUserId: number, currentUserId: number) {
    const date = new Date().toISOString();
    const message = {
      created_at: date,
      updated_at: date,
      receiver_id: targetUserId,
      sender_id: currentUserId,
      type: 'FRIEND_REQUEST',
      message: 'PENDING',
      read: false,
    };
    const { data, error } = await supabase.from('Notification')
      .insert([
        { ...message, user_id: targetUserId },
        { ...message, user_id: currentUserId },
      ])
      .select();
    if (error) throw error;
    return data;
  }

  async acceptFriendRequestNotification(targetUserId: number, currentUserId: number) {
    const date = new Date().toISOString();
    const message = {
      created_at: date,
      updated_at: date,
      receiver_id: currentUserId,
      sender_id: targetUserId,
      type: 'FRIEND_REQUEST',
      message: 'ACCEPTED',
      read: false,
    };
    const { data, error } = await supabase.from('Notification')
      .insert([
        { ...message, user_id: targetUserId },
        { ...message, user_id: currentUserId },
      ])
      .select();
    if (error) throw error;
    return data;
  }

  async deleteFriendRequestNotification(targetUserId: number, currentUserId: number) {
    const { data, error } = await supabase
      .from('Notification')
      .delete()
      .eq('sender_id', currentUserId)
      .eq('receiver_id', targetUserId);

    if (error) throw error;
    return data;
  }

  async deleteNotificationById(notificationId: number) {
    const { data, error } = await supabase.from('Notification')
      .delete()
      .eq('id', notificationId);
    // .eq('user_id', userId);
    if (error) throw error;
    return data;
  }

  async setNotificationAsSeenById(notificationId: number) {
    const { data, error } = await supabase.from('Notification')
      .update({ read: true })
      .eq('id', notificationId)
      // .eq('user_id', userId)
      .select();
    if (error) throw error;
    return data;
  }

  async getNotificationsByUser(userId: number, limit: number): Promise<INotification[]> {
    const { data, error } = await supabase
      .from('Notification')
      .select(`
        id,
        "createdAt":created_at,
        "updatedAt":updated_at,
        "senderId":sender_id,
        "receiverId":receiver_id,
        "userId":user_id,
        type,
        read,
        message,
        sender:User!sender_id(
          id,
          name,
          uid,
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
          uid,
          username,
          photos:UserPhoto!user_id(
            id,
            url,
            placeholder,
            order
          )
        )
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit)
      .returns<INotification[]>();

    if (error) throw error;

    return data;
  }
}


export default new NotificationService();
