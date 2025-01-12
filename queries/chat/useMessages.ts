import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IMessage } from 'react-native-gifted-chat';
import { supabase } from '@/supabase/config';
import { QueryKeys } from '@/queries/queryKeys';
import { useEffect } from 'react';
import { Json } from '@/supabase/database.types';
import { IFriendship } from '@/models/Friendship';
import chatService from '@/services/chatService';
import { useCometaStore } from '@/store/cometaStore';

const MAX_RECENT_MESSAGES = 49;


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
      const allMessages = (
        queryClient.getQueryData<IMessage[]>([QueryKeys.GET_FRIENDSHIP_MESSAGES, friendshipId]) || []
      );
      const latestMessages = allMessages.slice(-MAX_RECENT_MESSAGES); // remove the latest MAX_RECENT_MESSAGES

      const { data, error } = await supabase
        .from('Friendship')
        .update({
          messages: [...latestMessages, newMessage] as unknown as Json[], // 50 latest messages in total
          last_message_at: new Date().toISOString()
        })
        .eq('id', friendshipId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: (message) => {
      queryClient.setQueryData([QueryKeys.GET_FRIENDSHIP_MESSAGES, friendshipId], (oldData: IMessage[]) => {
        if (!oldData) return [message];
        return [...oldData, message];
      });
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
          const lastMessage = payload.new?.messages?.at(-1);
          if (!lastMessage) return;
          if (lastMessage.user._id === currentUser?.id) return;

          queryClient.setQueryData(
            [QueryKeys.GET_FRIENDSHIP_MESSAGES, friendshipId],
            (oldData: IMessage[]) => {
              if (!oldData) return payload.new.messages;
              return [...oldData, lastMessage];
            }
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
    sendMessage
  };
};
