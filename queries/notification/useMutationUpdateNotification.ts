import { INotification } from '@/models/Notification';
import notificationService from '@/services/notificationService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../queryKeys';
import { useCometaStore } from '@/store/cometaStore';
import { Notifier } from 'react-native-notifier';
import { ErrorToast } from '@/components/toastNotification/toastNotification';


export const useMutationNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const currentUser = useCometaStore(state => state.userProfile);
  return useMutation({
    mutationFn: (notificationId: number) => notificationService.setNotificationAsSeenById(notificationId),
    onSuccess: (_, notificationId) => {
      queryClient.setQueriesData<INotification[]>({
        queryKey: [QueryKeys.GET_NOTIFICATIONS, currentUser?.id]
      }, (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((notification) => {
          if (notification.id === notificationId) {
            return {
              ...notification,
              read: true
            };
          }
          return notification;
        });
      });
    }
  });
};

export const useMutationDeleteNotification = () => {
  const queryClient = useQueryClient();
  const currentUser = useCometaStore(state => state.userProfile);
  return useMutation({
    mutationFn: (notificationId: number) => notificationService.deleteNotificationById(notificationId),
    onMutate: (notificationId) => {
      queryClient.setQueriesData<INotification[]>({
        queryKey: [QueryKeys.GET_NOTIFICATIONS, currentUser?.id]
      }, (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter((notification) => notification.id !== notificationId);
      });
    },
    onError: (_, notificationId, context) => {
      Notifier.showNotification({
        title: 'Error',
        description: 'something went wrong, we will try again',
        Component: ErrorToast,
      });
    }
  });
};
