import { IFriendship, ILastMessage } from '@/models/Friendship';
import { supabase } from '@/supabase/config';
import { IMessage } from 'react-native-gifted-chat';


class ChatService {
  public async getMessagesByFrienshipId(friendshipId: number): Promise<IMessage[]> {
    const { data: friendship } = (
      await supabase
        .from('Friendship')
        .select('messages')
        .eq('id', friendshipId)
        .single<IFriendship>()
    );
    return (friendship?.messages || []);
  }

  public async getLatestMessagesByUserId(userId: number, limit = 20): Promise<ILastMessage[]> {
    const { data, error } = await supabase
      .from('Friendship')
      .select(`
      id,
      "createdAt":created_at,
      "updatedAt":updated_at,
      "senderId":sender_id,
      "receiverId":receiver_id,
      status,
      messages,
      "lastMessageAt":last_message_at,
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
      .eq('status', 'ACCEPTED')
      .not('last_message_at', 'is', null)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('last_message_at', { ascending: false })
      .limit(limit)
      .returns<ILastMessage[]>();

    if (error) throw error;

    return data.map<ILastMessage>(friendship => ({
      ...friendship,
      friend: {
        ...(friendship.senderId === userId
          ? friendship.receiver
          : friendship.sender),
        photos: friendship.senderId === userId
          ? friendship.receiver.photos
          : friendship.sender.photos
      },
      lastMessage: friendship.messages?.at(-1)
    }));
  }
}

export default new ChatService();
