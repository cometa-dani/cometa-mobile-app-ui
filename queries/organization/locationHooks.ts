import { useCometaStore } from '@/store/cometaStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../queryKeys';
import { ICreateLocation, ILocation } from '@/models/Localization';
import { locationService } from '@/services/company/locationService';


export const useMutationCreateLocation = () => {
  const queryClient = useQueryClient();
  const companyProfile = useCometaStore(state => state.companyProfile);

  return useMutation({
    mutationFn: async (payload: ICreateLocation) => {
      try {
        const res = await locationService.create(companyProfile?.id as number, payload);
        if (res.status === 201) {
          return res.data;
        }
      } catch (error) {
        throw new Error('failed to create');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_ORGANIZATION_LOCATIONS] });
    }
  });
};


export const useQueryGetLocations = () => {
  const isAuthenticated = useCometaStore(state => state.isAuthenticated);
  const companyProfile = useCometaStore(state => state.companyProfile);
  return (
    useQuery({
      enabled: isAuthenticated,
      queryKey: [QueryKeys.GET_ORGANIZATION_LOCATIONS],
      queryFn: async (): Promise<ILocation[]> => {
        const res = await locationService.getAll(companyProfile?.id as number);
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
