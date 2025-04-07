import notificationService from '@/services/notificationService';
import { useMutation } from '@tanstack/react-query';


export const useMutationUpdateNotification = () => {
  return useMutation({
    mutationFn: async ({ userId, notificationId }: { notificationId: number, userId: number }) => {
      notificationService.setNotificationAsSeenByUser(userId, notificationId);
      // const { data, error } = await supabase.from('Notification')
      //   .update({ read: true })
      //   .eq('id', payload.notificationId)
      //   .eq('user_id', payload.userId)
      //   .select();
      // if (error) throw error;
      // return data;
    }
  });
};
