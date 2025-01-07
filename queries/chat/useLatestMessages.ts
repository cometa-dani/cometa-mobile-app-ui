import { useCometaStore } from '@/store/cometaStore';
import { supabase } from '@/supabase/config';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Notifier } from 'react-native-notifier';
import { QueryKeys } from '../queryKeys';
import chatService from '@/services/chatService';
import { useEffect } from 'react';
import { Friendship } from '@/models/Friendship';


export const useLatestMessages = (limit = 20) => {
  const currentUser = useCometaStore(state => state.userProfile);
  const queryClient = useQueryClient();

  // Fetch initial messages
  const query = useQuery({
    queryKey: [QueryKeys.GET_LATEST_MESSAGES, currentUser?.id],
    enabled: !!currentUser?.id,
    queryFn: () => chatService.getLatestMessagesByUserId(currentUser?.id as number, limit)
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!currentUser?.id) return;

    const channel = supabase
      .channel('friendship_messages')
      .on<Friendship>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'Friendship',
          filter: `or(sender_id=eq.${currentUser.id},receiver_id=eq.${currentUser.id})`
        },
        async (payload) => {
          // Refresh the messages query when updates occur
          console.log('payload', payload);
          // await queryClient.invalidateQueries({
          //   queryKey: [QueryKeys.GET_LATEST_MESSAGES, currentUser.id]
          // });
          // // Optional: Show notification for new message
          // if (payload.new.messages?.length > (payload?.old?.messages?.length || 0)) {
          //   const newMessage = payload.new.messages.at(-1);
          //   if (newMessage?.user._id !== currentUser.id) {
          //     // Show notification for new message
          //     Notifier.showNotification({
          //       title: 'New Message',
          //       description: newMessage?.text || '',
          //       // ... other notification options
          //     });
          //   }
          // }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.id]);

  return query;
};
