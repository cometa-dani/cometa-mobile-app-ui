import { useQuery } from '@tanstack/react-query';
import userService from '../services/userService';
import { UserClientState } from '../models/User';
import { QueryKeys } from './queryKeys';


export const useQueryGetUserInfo = (dynamicParam: string) => {
  return (
    useQuery({
      enabled: !!dynamicParam,
      queryKey: [QueryKeys.GET_USER_INFO, dynamicParam],
      queryFn: async (): Promise<UserClientState> => {
        const res = await userService.getUserInfoByUid(dynamicParam);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to fetched');
        }
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};
