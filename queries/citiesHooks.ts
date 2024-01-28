import { useInfiniteQuery } from '@tanstack/react-query';
import { QueryKeys } from './queryKeys';
import citiesService from '../services/citiesService';


export const useInfiniteQueryGetCities = (prefixName: string) => {
  return useInfiniteQuery({
    enabled: true,
    initialPageParam: 0,

    queryKey: [QueryKeys.GET_CURRENT_LOCATION_CITIES, prefixName],
    queryFn: async ({ pageParam = 0 }) => {
      console.log('pageParam', pageParam);
      const response = await citiesService.searchCitiesByPrefix(pageParam, prefixName);
      if (response.status === 200) {
        return response.data;
      }
      else {
        throw new Error('failed to request data');
      }
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.data.length) {
        return null;
      }
      else {
        return lastPage.metadata.currentOffset + 10;
      }
    },
    retry: 3,
    retryDelay: 1_000 * 60 * 3
  });
};
