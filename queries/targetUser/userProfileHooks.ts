import { useQuery } from '@tanstack/react-query';
import { useCometaStore } from '../../store/cometaStore';
import { QueryKeys } from '../queryKeys';
import { GetTargetUser } from '../../models/User';
import userService from '../../services/userService';



export const useQueryGetTargetUserPeopleProfileByUid = (dynamicParam: string) => {
  const accessToken = useCometaStore(state => state.accessToken);

  return (
    useQuery({
      enabled: !!dynamicParam,
      queryKey: [QueryKeys.GET_TARGET_USER_INFO_PROFILE, dynamicParam],
      queryFn: async (): Promise<GetTargetUser> => {
        const res = await userService.getTargetUserProfile(dynamicParam, accessToken);
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
