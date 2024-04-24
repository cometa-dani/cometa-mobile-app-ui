import { useInfiniteQuery } from '@tanstack/react-query';
import { QueryKeys } from '../queryKeys';
import userService from '../../services/userService';


export const useInfiniteQuerySearchUsers = (username: string) => {
  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: [QueryKeys.SEARCH_USERS_BY_USERNAME_WITH_PAGINATION],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await userService.searchByUsernameWithPagination(username, pageParam);
      if (response.status === 200) {
        return response.data;
      }
      else {
        throw new Error('Error while fetching users');
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasNextCursor) {
        return lastPage.nextCursor;
      }
      return null;
    }
  });
};
