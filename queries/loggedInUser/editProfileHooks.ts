import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { QueryKeys } from '../queryKeys';
import citiesService from '../../services/citiesService';
import languagesServices from '../../services/languagesServices';


export const useInfiniteQueryGetCities = (prefixName: string, limit = 10) => {
  return useInfiniteQuery({
    enabled: true,
    initialPageParam: -1,

    queryKey: [QueryKeys.GET_CURRENT_LOCATION_CITIES, prefixName],
    queryFn: async ({ pageParam }) => {
      const response = await citiesService.searchCitiesByPrefix(prefixName, pageParam, limit);
      if (response.status === 200) {
        return response.data;
      }
      else {
        throw new Error('failed to request data');
      }
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.cities.length || lastPage.cities.length < limit) {
        return null;
      }
      else {
        return lastPage.nextCursor;
      }
    },
    retry: 2,
    retryDelay: 1_000 * 6
  });
};


export const useQueryGetAllLanguages = () => {
  return useQuery({
    queryKey: [QueryKeys.GET_ALL_LANGUAGES],
    queryFn: async (): Promise<string[]> => {
      const response = await languagesServices.getAll();
      if (response.status === 200) {
        return Object.values(response.data);
      }
      else {
        throw new Error('failed to request data');
      }
    },
    retry: 2,
    retryDelay: 1_000 * 6
  });
};
