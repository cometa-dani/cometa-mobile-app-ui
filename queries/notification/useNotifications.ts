import { useCometaStore } from '@/store/cometaStore';
import { supabase } from '@/supabase/config';
import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '../queryKeys';
import { useEffect } from 'react';
import notificationService from '@/services/notificationService';
import { INotification } from '@/models/Notification';


export const useNotifications = (limit = 100) => {
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
    const insertNotificationsChannel = supabase
      .channel('notifications_insert')
      .on<INotification>(
        'postgres_changes',
        {
          schema: 'public',
          event: 'INSERT',
          table: 'Notification',
          filter: `user_id=eq.${currentUser.id}`
        },
        () => query.refetch()
      )
      .on<INotification>(
        'postgres_changes',
        {
          schema: 'public',
          // important
          // this works with supabase sql editor:
          // ALTER TABLE public."Notification" REPLICA IDENTITY FULL;
          event: 'DELETE',
          table: 'Notification',
          filter: `user_id=eq.${currentUser.id}`
        },
        () => query.refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(insertNotificationsChannel);
    };
  }, [currentUser?.id]);

  return query;
};
