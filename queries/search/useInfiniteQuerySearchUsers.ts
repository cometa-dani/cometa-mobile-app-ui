import { useInfiniteQuery } from '@tanstack/react-query';
import { QueryKeys } from '../queryKeys';
import userService from '../../services/userService';


export const useInfiniteQuerySearchUsers = (username: string) => {
  return useInfiniteQuery({
    initialPageParam: -1,
    enabled: !!username,
    queryKey: [QueryKeys.SEARCH_USERS_BY_USERNAME_WITH_PAGINATION, username],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await userService.searchByUsernameWithPagination(username, pageParam, 10);
      if (response.status === 200) {
        return response.data;
      }
      else {
        throw new Error('Error while fetching users');
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.hasNextCursor) {
        return lastPage?.nextCursor;
      }
      return null;
    },
    retry: 2,
    retryDelay: 1_000 * 6,
    refetchInterval: 1_000 * 60 * 10
  });
};
