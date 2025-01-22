import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IMessage } from 'react-native-gifted-chat';
import { supabase } from '@/supabase/config';
import { QueryKeys } from '@/queries/queryKeys';
import { useEffect } from 'react';
import { Json } from '@/supabase/database.types';
import { IFriendship } from '@/models/Friendship';
import chatService from '@/services/chatService';
import { useCometaStore } from '@/store/cometaStore';

const MAX_RECENT_MESSAGES = 79;


export const useMessages = (friendshipId: number) => {
  const queryClient = useQueryClient();
  const currentUser = useCometaStore(state => state.userProfile);

  // Fetch messages
  const { data: messages = [] } = useQuery({
    persister: undefined,  // use mmvk storage
    enabled: !!friendshipId,
    queryKey: [QueryKeys.GET_FRIENDSHIP_MESSAGES, friendshipId],
    queryFn: () => chatService.getMessagesByFrienshipId(friendshipId)
  });

  // Send message mutation
  const { mutate: sendMessage } = useMutation({
    mutationFn: async (newMessage: IMessage) => {
      const latestMessages = messages.slice(-MAX_RECENT_MESSAGES); // remove the latest MAX_RECENT_MESSAGES
      const { data, error } = await supabase
        .from('Friendship')
        .update({
          messages: [...latestMessages, newMessage] as unknown as Json[], // 80 latest messages in total
          last_message_at: new Date().toISOString()
        })
        .eq('id', friendshipId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  });

  const { mutate: setRecievedMessage } = useMutation({
    mutationFn: async () => {
      const hasNewMessages: boolean = messages.some(message => !message.received && message.user._id !== currentUser?.id);
      if (!hasNewMessages) return;
      const { data, error } = await supabase
        .from('Friendship')
        .update({
          messages: (
            messages.map(message => (
              message.user._id == currentUser?.id ?
                message : ({ ...message, received: true })
            ))
          ) as unknown as Json[]
        })
        .eq('id', friendshipId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel(`Friendship:${friendshipId}`)
      .on<IFriendship>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'Friendship',
          filter: `id=eq.${friendshipId}`
        },
        (payload) => {
          queryClient.setQueryData(
            [QueryKeys.GET_FRIENDSHIP_MESSAGES, friendshipId],
            payload.new.messages || []
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [friendshipId]);

  return {
    messages,
    sendMessage,
    setRecievedMessage
  };
};
