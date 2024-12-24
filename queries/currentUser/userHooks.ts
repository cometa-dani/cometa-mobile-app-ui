import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import userService from '../../services/userService';
import { IGetBasicUserProfile, IGetDetailedUserProfile, ICreateUser, IUpdateUser } from '../../models/User';
import { IPhoto } from '../../models/Photo';
import { QueryKeys } from '../queryKeys';
import { useCometaStore } from '../../store/cometaStore';
import { IPhotoPlaceholder } from '@/components/onboarding/user/photosGrid/photoGrid';
import { useEffect } from 'react';


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
      retry: 1,
      retryDelay: 1_000 * 6
    })
  );
};


export const useQueryGetUserProfile = () => {
  const session = useCometaStore(state => state.session);
  const isAuthenticated = useCometaStore(state => state.isAuthenticated);
  return (
    useQuery({
      enabled: isAuthenticated,
      queryKey: [QueryKeys.GET_LOGGED_IN_USER_PROFILE],
      queryFn: async (): Promise<IGetDetailedUserProfile> => {
        const res = await userService.getUserProfileWithLikedEvents(session?.user.id as string);
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


export const usePrefetchUserProfile = () => {
  const queryClient = useQueryClient();
  const session = useCometaStore(state => state.session);
  const setIsAuthenticated = useCometaStore(state => state.setIsAuthenticated);
  const isAuthenticated = useCometaStore(state => state.isAuthenticated);

  useEffect(() => {
    if (!session?.user.id) return;
    if (isAuthenticated) return;
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_LOGGED_IN_USER_PROFILE],
      queryFn: async (): Promise<IGetDetailedUserProfile> => {
        const res = await userService.getUserProfileWithLikedEvents(session?.user.id as string);
        if (res.status === 200) {
          setIsAuthenticated(true);
          return res.data;
        }
        else {
          throw new Error('failed to fetched');
        }
      }
    })
      .then()
      .catch();
  }, [session?.user]);
};


interface IPhotosParams {
  pickedImgFiles: IPhotoPlaceholder[],
  userId: number
}

/**
 *
 * @param uuId universal unique id
 * @returns
 */
export const useMutationUploadUserPhotos = () => {
  return (
    useMutation({
      mutationFn:
        async ({ userId, pickedImgFiles }: IPhotosParams): Promise<IGetBasicUserProfile> => {
          const res = await userService.uploadUserPhotos(userId, pickedImgFiles);
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


interface IUpdatePhotoParams {
  userId: number,
  pickedAsset: IPhotoPlaceholder
}

/**
 *
 * @param uuId universal unique id
 * @returns
 */
export const useMutationUpdateUserPhoto = () => {
  return (
    useMutation({
      mutationFn:
        async ({ userId, pickedAsset }: IUpdatePhotoParams): Promise<IGetBasicUserProfile> => {
          const res = await userService.updateUserPhoto(userId, pickedAsset);
          if (res.status === 200) {
            return res.data;
          }
          else {
            throw new Error('failed fech');
          }
        }
    })
  );
};


type DeletePhotoArgs = { userID: number, photoUuid: string }

export const useMutationDeleteUserPhotoById = (dynamicParam?: string) => {
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
        await queryClient.cancelQueries({ queryKey: [QueryKeys.GET_LOGGED_IN_USER_PROFILE, dynamicParam] });
        // TODO
        queryClient
          .setQueryData<IGetDetailedUserProfile>
          ([QueryKeys.GET_LOGGED_IN_USER_PROFILE, dynamicParam], (oldState): IGetDetailedUserProfile => {
            const filteredPhotos: IPhoto[] = oldState?.photos.filter(({ uuid }) => photoUuid !== uuid) || [];
            const optimisticState = {
              ...oldState,
              photos: filteredPhotos

            } as IGetDetailedUserProfile;

            return optimisticState;
          });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_LOGGED_IN_USER_PROFILE, dynamicParam] });
      }
    })
  );
};


export const useMutationDeleteUser = () => {
  return (
    useMutation({
      mutationFn:
        async (userId: number): Promise<IGetBasicUserProfile> => {
          const res = await userService.deleteUserById(userId);
          if (res.status === 204) {
            return res.data;
          }
          else {
            throw new Error('failed fech');
          }
        }
    })
  );
};
