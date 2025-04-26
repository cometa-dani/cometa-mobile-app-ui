import { useCometaStore } from '@/store/cometaStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { QueryKeys } from '../queryKeys';
import { ILocation } from '@/models/Localization';
import { locationService } from '@/services/company/locationService';


export const useMutateCreateEvent = () => {
  return useMutation({
    mutationFn: (payload: ILocation) => locationService.create(payload),
  });
};


export const useQueryGetLocations = () => {
  const isAuthenticated = useCometaStore(state => state.isAuthenticated);
  return (
    useQuery({
      enabled: isAuthenticated,
      queryKey: [QueryKeys.GET_ORGANIZATION_LOCATIONS],
      queryFn: async (): Promise<ILocation[]> => {
        const res = await locationService.getAll();
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to fetched');
        }
      }
    })
  );
};
