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
      const filteredData = data.filter(notification => (
        (notification.receiverId === currentUser?.id) && (notification.message === 'PENDING')
      )
        ||
        notification.message === 'ACCEPTED'
      )
        || [];
      return filteredData;
    },
    enabled: !!currentUser?.id,
    queryFn: () => notificationService.getNotificationsByUser(currentUser?.id as number, limit)
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!currentUser?.id) return;

    // const receiverChannel = supabase
    //   .channel('notifications_receiver')
    //   .on<INotification>(
    //     'postgres_changes',
    //     {
    //       schema: 'public',
    //       event: 'INSERT',
    //       table: 'Notification',
    //       filter: `receiver_id=eq.${currentUser.id}`
    //     },
    //     (payload) => {
    //       queryClient.setQueryData<INotification[]>([QueryKeys.GET_NOTIFICATIONS, currentUser.id], (oldData) => {
    //         if (!oldData) return [];
    //         // insert
    //         return [payload.new, ...oldData];
    //       });
    //     }
    //   )
    //   // .on<INotification>(
    //   //   'postgres_changes',
    //   //   {
    //   //     schema: 'public',
    //   //     event: 'UPDATE',
    //   //     table: 'Notification',
    //   //     filter: `receiver_id=eq.${currentUser.id}`
    //   //   },
    //   //   (payload) => {
    //   //     queryClient.setQueryData<INotification[]>([QueryKeys.GET_NOTIFICATIONS, currentUser.id], (oldData) => {
    //   //       if (!oldData) return [];
    //   //       // update
    //   //       return oldData.map(notification => {
    //   //         if (notification.id === payload.new.id) {
    //   //           return payload.new;
    //   //         }
    //   //         return notification;
    //   //       });
    //   //     });
    //   //   }
    //   // )
    //   .on<INotification>(
    //     'postgres_changes',
    //     {
    //       schema: 'public',
    //       event: 'DELETE',
    //       table: 'Notification',
    //       filter: `receiver_id=eq.${currentUser.id}`
    //     },
    //     () => query.refetch()
    //   )
    //   .subscribe();

    const notificationsChannel = supabase
      .channel('notifications')
      .on<INotification>(
        'postgres_changes',
        {
          schema: 'public',
          event: 'INSERT',
          table: 'Notification',
          filter: `user_id=eq.${currentUser.id}`
        },
        (payload) => {
          queryClient.setQueryData<INotification[]>([QueryKeys.GET_NOTIFICATIONS, currentUser.id], (oldData) => {
            if (!oldData) return [];
            // insert
            return [payload.new, ...oldData];
          });
        }
      )
      // .subscribe()
      // .on<INotification>(
      //   'postgres_changes',
      //   {
      //     schema: 'public',
      //     event: 'UPDATE',
      //     table: 'Notification',
      //     filter: `sender_id=eq.${currentUser.id}`
      //   },
      //   (payload) => {
      //     queryClient.setQueryData<INotification[]>([QueryKeys.GET_NOTIFICATIONS, currentUser.id], (oldData) => {
      //       if (!oldData) return [];
      //       // update
      //       return oldData.map(notification => {
      //         if (notification.id === payload.new.id) {
      //           return payload.new;
      //         }
      //         return notification;
      //       });
      //     });
      //   }
      // )
      .on<INotification>(
        'postgres_changes',
        {
          schema: 'public',
          event: 'DELETE',
          table: 'Notification',
          filter: `user_id=eq.${currentUser.id}`
        },
        () => query.refetch()
      )
      .subscribe();

    return () => {
      // supabase.removeChannel(receiverChannel);
      supabase.removeChannel(notificationsChannel);
    };
  }, [currentUser?.id]);

  return query;
};
