import { useCometaStore } from '@/store/cometaStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../queryKeys';
import eventService from '@/services/company/eventService';
import { ICreateEvent, IEvent } from '@/models/Event';
import { IPhotoPlaceholder } from '@/components/onboarding/photosGrid/photoGrid';
import { IOrganization } from '@/models/Organization';


export const useMutateCreateEvent = () => {
  const company = useCometaStore(state => state.companyProfile);
  return (
    useMutation({
      mutationFn: async (payload: ICreateEvent) => {
        try {
          const res = await eventService.create(
            company?.id as number,
            { ...payload, organizationId: company?.id as number }
          );
          if (res.status === 201) {
            return res.data;
          }
        } catch (error) {
          throw new Error('failed to create event');
        }
      },
    })
  );
};


export const useMutateDeleteEvent = () => {
  const queryClient = useQueryClient();
  const company = useCometaStore(state => state.companyProfile);
  return (
    useMutation({
      mutationFn: async (eventId: number) => {
        try {
          const res = await eventService.deleteEvent(
            company?.id as number,
            eventId
          );
          if (res.status === 204) {
            return res.data;
          }
        } catch (error) {
          throw new Error('failed to create event');
        }
      },
      onSuccess: async () => {
        try {
          await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_ORGANIZATION_EVENTS] });
        } catch (error) {
          return null;
        }
      }
    })
  );
};


interface IPhotosParams {
  pickedImgFiles: IPhotoPlaceholder[],
  eventId: number
}
/**
 *
 * @param uuId universal unique id
 * @returns
 */
export const useMutationUploadEventsPhotos = () => {
  const queryClient = useQueryClient();
  const company = useCometaStore(state => state.companyProfile);
  return (
    useMutation({
      mutationFn:
        async ({ eventId, pickedImgFiles }: IPhotosParams): Promise<IOrganization> => {
          const res = await eventService.uploadPhotos(company?.id as number, eventId, pickedImgFiles);
          if (res.status === 201) {
            return res.data;
          }
          else {
            throw new Error('failed fech');
          }
        },
      onSuccess: async () => {
        try {
          await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_ORGANIZATION_EVENTS] });
        } catch (error) {
          return null;
        }
      }
    })
  );
};


export const useQueryGetEventsPaginated = () => {
  const isAuthenticated = useCometaStore(state => state.isAuthenticated);
  const company = useCometaStore(state => state.companyProfile);
  return (
    useQuery({
      enabled: isAuthenticated,
      queryKey: [QueryKeys.GET_ORGANIZATION_EVENTS],
      queryFn: async (): Promise<IEvent[]> => {
        const res = await eventService.getAllEvents(company?.id as number);
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
