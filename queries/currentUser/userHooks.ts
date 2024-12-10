import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import userService from '../../services/userService';
import { IGetBasicUserProfile, IGetDetailedUserProfile, ICreateUser, IUpdateUser } from '../../models/User';
import { IPhoto } from '../../models/Photo';
import { QueryKeys } from '../queryKeys';
import { useCometaStore } from '../../store/cometaStore';
import { IPhotoPlaceholder } from '@/components/onboarding/user/photosGrid/photosGrid';


export const useMutationCreateUser = () => {
  return (
    useMutation({
      mutationFn: async (payload: ICreateUser) => {
        const res = await userService.create(payload);
        if (res.status === 201) {
          return res.data;
        }
        else {
          throw new Error('failed fech');
        }
      }
    })
  );
};


export const useMutationUpdateUserById = () => {
  const queryClient = useQueryClient();
  const uuid = useCometaStore(state => state.uid);
  return (
    useMutation({
      mutationFn: async (args: { userId: number, payload: Partial<IUpdateUser> }) => {
        const res = await userService.updateById(args.userId, args.payload);
        if (res.status == 200 || res.status == 201) {
          return res.data;
        }
        else {
          throw new Error('failed fetched');
        }
      },
      onMutate: async ({ payload }) => {
        queryClient
          .setQueryData<IGetDetailedUserProfile>
          ([QueryKeys.GET_LOGGED_IN_USER_INFO_PROFILE, uuid], (oldState): IGetDetailedUserProfile => {
            const optimisticState = {
              ...oldState,
              ...payload
            } as IGetDetailedUserProfile;

            return optimisticState;
          });
      },
      onSuccess: async () => {
        // await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_LOGGED_IN_USER_INFO_PROFILE] });
      },
      retry: 2,
      retryDelay: 1_000 * 6
    })
  );
};


export const useQueryGetUserProfile = () => {
  const session = useCometaStore(state => state.session);
  return (
    useQuery({
      enabled: !!session?.user.id,
      queryKey: [QueryKeys.GET_LOGGED_IN_USER_INFO_PROFILE],
      queryFn: async (): Promise<IGetDetailedUserProfile> => {
        const res = await userService.getUserInfoByUidWithLikedEvents(session?.user.id as string);
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


type PhotosParams = {
  pickedImgFiles: IPhotoPlaceholder[],
  userId: number
};

/**
 *
 * @param uuId universal unique id
 * @returns
 */
export const useMutationUploadUserPhotos = (uuId?: string) => {
  const queryClient = useQueryClient();
  return (
    useMutation({
      mutationFn:
        async ({ userId, pickedImgFiles }: PhotosParams): Promise<IGetBasicUserProfile> => {
          const res = await userService.uploadUserPhotos(userId, pickedImgFiles);
          if (res.status === 201) {
            return res.data;
          }
          else {
            throw new Error('failed fech');
          }
        },
      onMutate: async ({ pickedImgFiles }) => {
        await queryClient.cancelQueries({ queryKey: [QueryKeys.GET_LOGGED_IN_USER_INFO_PROFILE, uuId] });
        queryClient
          .setQueryData<IGetDetailedUserProfile>
          ([QueryKeys.GET_LOGGED_IN_USER_INFO_PROFILE, uuId], (oldState): IGetDetailedUserProfile => {

            const optimisticState = {
              ...oldState,
              photos: [...(oldState?.photos || []), ...pickedImgFiles]

            } as IGetDetailedUserProfile;

            return optimisticState;
          });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_LOGGED_IN_USER_INFO_PROFILE, uuId] });
      },
      retry: 1,
      retryDelay: 1_000 * 6
    })
  );
};


type DeletePhotoArgs = { userID: number, photoUuid: string }

export const useMutationDeleteUserById = (dynamicParam: string) => {
  const queryClient = useQueryClient();
  return (
    useMutation({
      mutationFn:
        async ({ userID, photoUuid }: DeletePhotoArgs): Promise<IGetBasicUserProfile> => {
          const res = await userService.deletePhotoById(userID, photoUuid);
          if (res.status === 204) {
            return res.data;
          }
          else {
            throw new Error('failed fech');
          }
        },
      onMutate: async ({ photoUuid }) => {
        await queryClient.cancelQueries({ queryKey: [QueryKeys.GET_LOGGED_IN_USER_INFO_PROFILE, dynamicParam] });
        // TODO
        queryClient
          .setQueryData<IGetDetailedUserProfile>
          ([QueryKeys.GET_LOGGED_IN_USER_INFO_PROFILE, dynamicParam], (oldState): IGetDetailedUserProfile => {
            const filteredPhotos: IPhoto[] = oldState?.photos.filter(({ uuid }) => photoUuid !== uuid) || [];

            const optimisticState = {
              ...oldState,
              photos: filteredPhotos

            } as IGetDetailedUserProfile;

            return optimisticState;
          });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_LOGGED_IN_USER_INFO_PROFILE, dynamicParam] });
      },
      retry: 2,
      retryDelay: 1_000 * 6
    })
  );
};
