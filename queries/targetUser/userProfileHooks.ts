import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '../queryKeys';
import { IGetTargetUser } from '../../models/User';
import userService from '../../services/userService';


export const useQueryGetTargetUserPeopleProfileByUid = (dynamicParam: string) => {
  return (
    useQuery({
      enabled: !!dynamicParam,
      queryKey: [QueryKeys.GET_TARGET_USER_INFO_PROFILE, dynamicParam],
      queryFn: async (): Promise<IGetTargetUser> => {
        const res = await userService.getTargetUserProfile(dynamicParam);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to fetched');
        }
      },
      retry: 2,
      retryDelay: 1_000 * 6
    })
  );
};
