import { ICompanyCreate } from '@/models/company/Company';
import { companyService } from '@/services/company/company';
import { useMutation } from '@tanstack/react-query';

export const useMutateCreateOrganization = () => {
  return useMutation({
    mutationFn: (payload: ICompanyCreate) => companyService.create(payload),
  });
};
