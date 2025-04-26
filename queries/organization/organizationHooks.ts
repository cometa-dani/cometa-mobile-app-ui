import { ICompany, ICompanyCreate } from '@/models/company/Company';
import { companyService } from '@/services/company/companyService';
import { useCometaStore } from '@/store/cometaStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { QueryKeys } from '../queryKeys';


export const useMutateCreateOrganization = () => {
  return useMutation({
    mutationFn: (payload: ICompanyCreate) => companyService.create(payload),
  });
};


export const useQueryGetCompanyProfile = () => {
  const session = useCometaStore(state => state.session);
  const setCompanyProfile = useCometaStore(state => state.setCompanyProfile);
  const setIsAuthenticated = useCometaStore(state => state.setIsAuthenticated);
  return (
    useQuery({
      queryKey: [QueryKeys.GET_ORGANIZATION_INFO_BY_ID],
      queryFn: async (): Promise<ICompany> => {
        const res = await companyService.getProfile(session?.user.id as string);
        if (res.status === 200) {
          setCompanyProfile(res.data);
          setIsAuthenticated(true);
          return res.data;
        }
        else {
          throw new Error('failed to fetched');
        }
      }
    })
  );
};
