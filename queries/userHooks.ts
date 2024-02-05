import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import userService from '../services/userService';
import { GetBasicUserProfile, GetDetailedUserProfile, UserClientState } from '../models/User';
import { Photo } from '../models/Photo';
import { QueryKeys } from './queryKeys';
import { useCometaStore } from '../store/cometaStore';
import { ImagePickerAsset } from 'expo-image-picker';
import uuid from 'react-native-uuid';


export const useQueryGetUserProfileByUid = (dynamicParam: string) => {
  const accessToken = useCometaStore(state => state.accessToken);

  return (
    useQuery({
      enabled: !!dynamicParam,
      queryKey: [QueryKeys.GET_USER_INFO, dynamicParam],
      queryFn: async (): Promise<GetDetailedUserProfile> => {
        const res = await userService.getUserInfoByUid(dynamicParam, accessToken);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to fetched');
        }
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};


export const useMutationUserProfileById = () => {
  const queryClient = useQueryClient();
  const uuid = useCometaStore(state => state.uid);

  return (
    useMutation({
      mutationFn: async (args: { userId: number, payload: Partial<UserClientState> }) => {
        const res = await userService.updateById(args.userId, args.payload);
        if (res.status == 201) {
          return res.data;
        }
        else {
          throw new Error('failed fetched');
        }
      },
      onMutate: async ({ payload }) => {
        queryClient
          .setQueryData<GetDetailedUserProfile>
          ([QueryKeys.GET_USER_INFO, uuid], (oldState): GetDetailedUserProfile => {
            const optimisticState = {
              ...oldState,
              ...payload
            } as GetDetailedUserProfile;

            return optimisticState;
          });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USER_INFO] });
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};


export const useQueryGetNewPeopleProfileByUid = (dynamicParam: string) => {
  const accessToken = useCometaStore(state => state.accessToken);

  return (
    useQuery({
      enabled: !!dynamicParam,
      queryKey: [QueryKeys.GET_NEW_PEOPLE_INFO, dynamicParam],
      queryFn: async (): Promise<GetDetailedUserProfile> => {
        const res = await userService.getUserInfoByUid(dynamicParam, accessToken);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to fetched');
        }
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};


type PhotosParams = { pickedImgFiles: ImagePickerAsset[], userID: number };

export const useMutationUploadUserPhotos = (dynamicParam: string) => {
  const queryClient = useQueryClient();

  return (
    useMutation({
      mutationFn:
        async ({ userID, pickedImgFiles }: PhotosParams): Promise<GetBasicUserProfile> => {
          const res = await userService.uploadManyPhotosByUserId(userID, pickedImgFiles);
          if (res.status === 200) {
            return res.data;
          }
          else {
            throw new Error('failed fech');
          }
        },

      onMutate: async ({ pickedImgFiles }) => {
        await queryClient.cancelQueries({ queryKey: [QueryKeys.GET_USER_INFO, dynamicParam] });

        queryClient
          .setQueryData<GetDetailedUserProfile>
          ([QueryKeys.GET_USER_INFO, dynamicParam], (oldState): GetDetailedUserProfile => {
            const newPhotos: Partial<Photo>[] = pickedImgFiles.map(img => ({ url: img.uri, uuid: uuid.v4() as string })) || [];

            const optimisticState = {
              ...oldState,
              photos: [...(oldState?.photos || []), ...newPhotos]

            } as GetDetailedUserProfile;

            return optimisticState;
          });
      },

      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USER_INFO, dynamicParam] });
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};


type DeletePhotoArgs = { userID: number, photoUuid: string }

export const useMutationDeleteUserPhotoByUuid = (dynamicParam: string) => {
  const queryClient = useQueryClient();

  return (
    useMutation({
      mutationFn:
        async ({ userID, photoUuid }: DeletePhotoArgs): Promise<GetBasicUserProfile> => {
          const res = await userService.deletePhotoByUuid(userID, photoUuid);
          if (res.status === 204) {
            return res.data;
          }
          else {
            throw new Error('failed fech');
          }
        },

      onMutate: async ({ photoUuid }) => {
        await queryClient.cancelQueries({ queryKey: [QueryKeys.GET_USER_INFO, dynamicParam] });
        // TODO
        queryClient
          .setQueryData<GetDetailedUserProfile>
          ([QueryKeys.GET_USER_INFO, dynamicParam], (oldState): GetDetailedUserProfile => {
            const filteredPhotos: Photo[] = oldState?.photos.filter(({ uuid }) => photoUuid !== uuid) || [];

            const optimisticState = {
              ...oldState,
              photos: filteredPhotos

            } as GetDetailedUserProfile;

            return optimisticState;
          });
      },

      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USER_INFO, dynamicParam] });
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};


type AvatarParams = { pickedImgFile: ImagePickerAsset, userID: number };

export const useMutationUpdateUserAvatar = (dynamicParam: string) => {
  const queryClient = useQueryClient();

  return (
    useMutation({
      mutationFn:
        async ({ userID, pickedImgFile }: AvatarParams): Promise<GetBasicUserProfile> => {
          const res = await userService.uploadOrUpdateAvatarImgByUserID(userID, pickedImgFile);
          if (res.status === 200) {
            return res.data;
          }
          else {
            throw new Error('failed fech');
          }
        },

      onMutate: async ({ pickedImgFile }) => {
        await queryClient.cancelQueries({ queryKey: [QueryKeys.GET_USER_INFO, dynamicParam] });

        queryClient
          .setQueryData<GetDetailedUserProfile>
          ([QueryKeys.GET_USER_INFO, dynamicParam], (oldState): GetDetailedUserProfile => {

            const optimisticState = {
              ...oldState,
              avatar: pickedImgFile.uri

            } as GetDetailedUserProfile;

            return optimisticState;
          });
      },

      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USER_INFO, dynamicParam] });
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};
