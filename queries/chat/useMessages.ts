import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IMessage } from 'react-native-gifted-chat';
import { supabase } from '@/supabase/config';
import { QueryKeys } from '@/queries/queryKeys';
import { useEffect } from 'react';
import { Json } from '@/supabase/database.types';
import { Friendship } from '@/models/Friendship';
import chatService from '@/services/chatService';


export const useMessages = (friendshipId: number) => {
  const queryClient = useQueryClient();

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
      const { data: existingFriendship } = await supabase
        .from('Friendship')
        .select('messages')
        .eq('id', friendshipId)
        .single();

      const updatedMessages = [...(existingFriendship?.messages || []), newMessage];

      const { data, error } = await supabase
        .from('Friendship')
        .update({
          messages: updatedMessages as unknown as Json[],
          last_message_at: new Date().toISOString()
        })
        .eq('id', friendshipId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: (message) => {
      queryClient.setQueryData([QueryKeys.GET_FRIENDSHIP_MESSAGES, friendshipId], [...messages, message]);
    }
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel(`Friendship:${friendshipId}`)
      .on<Friendship>(
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
            payload.new.messages
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
