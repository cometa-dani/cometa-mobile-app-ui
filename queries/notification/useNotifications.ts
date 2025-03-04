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
      return data.filter(frindship => frindship.senderId !== currentUser?.id) || [];
    },
    enabled: !!currentUser?.id,
    queryFn: () => notificationService.getLatestByUser(currentUser?.id as number, limit)
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!currentUser?.id) return;
    // const handleSubscription = async (payload: RealtimePostgresChangesPayload<IFriendship>) => {
    //   // const oldData = queryClient.getQueryData<INotification[]>([QueryKeys.GET_NOTIFICATIONS, currentUser.id]);
    //   // const foundFriendship = oldData?.find(friendship => friendship.id === payload.new.id);
    //   // try {
    //   //   if (!foundFriendship) {
    //   //     await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_NOTIFICATIONS, currentUser.id] });
    //   //     return;
    //   //   }
    //   // } catch (error) {
    //   //   return null;
    //   // }


    //   // // Update the messages for the specific friendship
    //   // queryClient.setQueryData(
    //   //   [QueryKeys.GET_FRIENDSHIP_MESSAGES, foundFriendship.id],
    //   //   payload.new.messages || []
    //   // );

    //   if (payload.eventType === 'UPDATE') {
    //     console.log('UPDATE', payload.new);
    //     queryClient.setQueryData<INotification[]>([QueryKeys.GET_NOTIFICATIONS, currentUser.id], (oldData) => {
    //       if (!oldData) return [];
    //       // update
    //       return oldData.map(friendship => {
    //         if (friendship.id === payload.new.id) {
    //           return payload.new as unknown as INotification;
    //         }
    //         return friendship;
    //       });
    //     });
    //   }
    //   if (payload.eventType === 'INSERT') {
    //     console.log('INSERT', payload.new);
    //     queryClient.setQueryData<INotification[]>([QueryKeys.GET_NOTIFICATIONS, currentUser.id], (oldData) => {
    //       if (!oldData) return [];
    //       // insert
    //       return [payload.new as unknown as INotification, ...oldData];
    //     });
    //   }
    //   if (payload.eventType === 'DELETE') {
    //     console.log('DELETE', payload.new);
    //     // queryClient.setQueryData<INotification[]>([QueryKeys.GET_NOTIFICATIONS, currentUser.id], (oldData) => {
    //     //   if (!oldData) return [];
    //     //   // delete
    //     //   return oldData.filter(friendship => friendship.id !== payload.new.id);
    //     // });
    //   }
    // };

    // Subscribe to friendships where user is sender

    const senderChannel = supabase
      .channel('notifications')
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
          filter: `receiver_id=eq.${currentUser.id}`
        },
        (payload) => {
          console.log('DELETE', payload.new);
          // queryClient.setQueryData<INotification[]>([QueryKeys.GET_NOTIFICATIONS, currentUser.id], (oldData) => {
          //   if (!oldData) return [];
          //   // delete
          //   return oldData.filter(friendship => friendship.id !== payload.new.id);
          // });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(senderChannel);
    };
  }, [currentUser?.id]);

  return query;
};
