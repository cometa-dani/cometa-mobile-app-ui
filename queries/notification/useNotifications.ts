import { useCometaStore } from '@/store/cometaStore';
import { supabase } from '@/supabase/config';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../queryKeys';
import { useEffect } from 'react';
import { IFriendship } from '@/models/Friendship';
import notificationService from '@/services/notificationService';
import { INotification } from '@/models/Notification';


export const useNotifications = (limit = 100) => {
  const queryClient = useQueryClient();
  const currentUser = useCometaStore(state => state.userProfile);

  // Fetch initial messages
  const query = useQuery({
    queryKey: [QueryKeys.GET_NOTIFICATIONS, currentUser?.id],
    select(data) {
      return data.filter(friendship => (
        friendship.receiverId === currentUser?.id && friendship.status === 'PENDING')
        ||
        friendship.status === 'ACCEPTED'
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
      .on<IFriendship>(
        'postgres_changes',
        {
          schema: 'public',
          event: 'INSERT',
          table: 'Friendship',
          filter: `receiver_id=eq.${currentUser.id}`
        },
        (payload) => {
          queryClient.setQueryData<INotification[]>([QueryKeys.GET_NOTIFICATIONS, currentUser.id], (oldData) => {
            if (!oldData) return [];
            // insert
            return [payload.new as unknown as INotification, ...oldData];
          });
        }
      )
      .on<IFriendship>(
        'postgres_changes',
        {
          schema: 'public',
          event: 'DELETE',
          table: 'Friendship',
          filter: `receiver_id=eq.${currentUser.id}`
        },
        (payload) => {
          // console.log('DELETE', payload.new);
          // queryClient.setQueryData<INotification[]>([QueryKeys.GET_NOTIFICATIONS, currentUser.id], (oldData) => {
          //   if (!oldData) return [];
          //   // delete
          //   return oldData.filter(friendship => friendship.id !== payload.new.id);
          // });
        }
      )
      .subscribe();

    const senderChannel = supabase
      .channel('notifications_sender')
      .on<IFriendship>(
        'postgres_changes',
        {
          schema: 'public',
          event: 'UPDATE',
          table: 'Friendship',
          filter: `sender_id=eq.${currentUser.id}`
        },
        (payload) => {
          queryClient.setQueryData<INotification[]>([QueryKeys.GET_NOTIFICATIONS, currentUser.id], (oldData) => {
            if (!oldData) return [];
            // update
            return oldData.map(friendship => {
              if (friendship.id === payload.new.id) {
                return payload.new as unknown as INotification;
              }
              return friendship;
            });
          });
        }
      )
      .on<IFriendship>(
        'postgres_changes',
        {
          schema: 'public',
          event: 'DELETE',
          table: 'Friendship',
          filter: `sender_id=eq.${currentUser.id}`
        },
        (payload) => {
          // console.log('DELETE', payload.new);
          // queryClient.setQueryData<INotification[]>([QueryKeys.GET_NOTIFICATIONS, currentUser.id], (oldData) => {
          //   if (!oldData) return [];
          //   // delete
          //   return oldData.filter(friendship => friendship.id !== payload.new.id);
          // });
        }
      );

    return () => {
      supabase.removeChannel(receiverChannel);
      supabase.removeChannel(senderChannel);
    };
  }, [currentUser?.id]);

  return query;
};
