import { useCometaStore } from '@/store/cometaStore';
import { supabase } from '@/supabase/config';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../queryKeys';
import { useEffect } from 'react';
import notificationService from '@/services/notificationService';
import { INotification } from '@/models/Notification';


export const useNotifications = (limit = 100) => {
  const queryClient = useQueryClient();
  const currentUser = useCometaStore(state => state.userProfile);

  // Fetch initial messages
  const query = useQuery({
    queryKey: [QueryKeys.GET_NOTIFICATIONS, currentUser?.id],
    select(data) {
      return data.filter(notification => (
        (notification.receiverId === currentUser?.id) && (notification.message === 'PENDING')
      )
        ||
        notification.message === 'ACCEPTED'
      )
        || [];
    },
    enabled: !!currentUser?.id,
    queryFn: () => notificationService.getLatestByUser(currentUser?.id as number, limit)
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!currentUser?.id) return;

    const receiverChannel = supabase
      .channel('notifications_receiver')
      .on<INotification>(
        'postgres_changes',
        {
          schema: 'public',
          event: 'INSERT',
          table: 'Notification',
          filter: `receiver_id=eq.${currentUser.id}`
        },
        (payload) => {
          queryClient.setQueryData<INotification[]>([QueryKeys.GET_NOTIFICATIONS, currentUser.id], (oldData) => {
            if (!oldData) return [];
            // insert
            return [payload.new, ...oldData];
          });
        }
      )
      .on<INotification>(
        'postgres_changes',
        {
          schema: 'public',
          event: 'DELETE',
          table: 'Notification',
          filter: `receiver_id=eq.${currentUser.id}`
        },
        () => query.refetch()
      )
      .subscribe();

    const senderChannel = supabase
      .channel('notifications_sender')
      .on<INotification>(
        'postgres_changes',
        {
          schema: 'public',
          event: 'UPDATE',
          table: 'Notification',
          filter: `sender_id=eq.${currentUser.id}`
        },
        (payload) => {
          queryClient.setQueryData<INotification[]>([QueryKeys.GET_NOTIFICATIONS, currentUser.id], (oldData) => {
            if (!oldData) return [];
            // update
            return oldData.map(friendship => {
              if (friendship.id === payload.new.id) {
                return payload.new;
              }
              return friendship;
            });
          });
        }
      )
      .on<INotification>(
        'postgres_changes',
        {
          schema: 'public',
          event: 'DELETE',
          table: 'Notification',
          filter: `sender_id=eq.${currentUser.id}`
        },
        () => query.refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(receiverChannel);
      supabase.removeChannel(senderChannel);
    };
  }, [currentUser?.id]);

  return query;
};
