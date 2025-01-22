import { useCometaStore } from '@/store/cometaStore';
import { supabase } from '@/supabase/config';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../queryKeys';
import chatService from '@/services/chatService';
import { useEffect } from 'react';
import { IFriendship, ILastMessage } from '@/models/Friendship';
import { RealtimePostgresUpdatePayload } from '@supabase/supabase-js';

const counter = 0;

export const useLatestMessages = (limit = 20) => {
  const queryClient = useQueryClient();
  const currentUser = useCometaStore(state => state.userProfile);
  const setNewMessages = useCometaStore(state => state.setNewMessages);

  // Fetch initial messages
  const query = useQuery({
    queryKey: [QueryKeys.GET_LATEST_MESSAGES, currentUser?.id],
    enabled: !!currentUser?.id,
    queryFn: () => chatService.getLatestMessagesByUserId(currentUser?.id as number, limit)
  });

  useEffect(() => {
    if (!query.data) return;
    const totalMessages = (
      query.data.reduce((acc, friendship) => acc + (
        friendship.messages
          ?.reduce((acc, message) => acc + (
            !message.received && message.user._id !== currentUser?.id ? 1 : 0
          ),
            counter
          )
      ),
        counter
      )
    );
    setNewMessages(totalMessages);
  }, [query.data]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!currentUser?.id) return;
    const handleSubscription = async (payload: RealtimePostgresUpdatePayload<IFriendship>) => {
      const oldData = queryClient.getQueryData<ILastMessage[]>([QueryKeys.GET_LATEST_MESSAGES, currentUser.id]);
      const foundFriendship = oldData?.find(friendship => friendship.id === payload.new.id);
      try {
        if (!foundFriendship) {
          await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_LATEST_MESSAGES, currentUser.id] });
          return;
        }
      } catch (error) {
        return null;
      }
      queryClient.setQueryData<ILastMessage[]>([QueryKeys.GET_LATEST_MESSAGES, currentUser.id], () => {
        if (!oldData) return [];
        return oldData.map(friendship => {
          if (friendship.id === payload.new.id) {
            return {
              ...friendship,
              messages: payload.new.messages,
              lastMessage: payload.new.messages?.at(-1),
            };
          }
          return friendship;
        });
      });

      // Update the messages for the specific friendship
      queryClient.setQueryData(
        [QueryKeys.GET_FRIENDSHIP_MESSAGES, foundFriendship.id],
        payload.new.messages || []
      );
    };

    // Subscribe to friendships where user is sender
    const senderChannel = supabase
      .channel('friendship_messages_as_sender')
      .on<IFriendship>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'Friendship',
          filter: `sender_id=eq.${currentUser.id}`
        },
        handleSubscription
      )
      .subscribe();

    // Subscribe to friendships where user is receiver
    const receiverChannel = supabase
      .channel('friendship_messages_as_receiver')
      .on<IFriendship>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'Friendship',
          filter: `receiver_id=eq.${currentUser.id}`
        },
        handleSubscription
      )
      .subscribe();

    return () => {
      supabase.removeChannel(senderChannel);
      supabase.removeChannel(receiverChannel);
    };
  }, [currentUser?.id]);

  return query;
};
