import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import userService from '../services/userService';
import { GetBasicUserProfile, GetDetailedUserProfile, Photo } from '../models/User';
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

export const useMutationUploadUserPhotos = () => {
  const queryClient = useQueryClient();

  return (
    useMutation({
      mutationFn:
        async ({ userID, pickedImgFiles }: PhotosParams): Promise<GetBasicUserProfile> => {
          const res = await userService.uploadManyImagesByUserId(userID, pickedImgFiles);
          if (res.status === 200) {
            return res.data;
          }
          else {
            throw new Error('failed fech');
          }
        },

      onMutate: async ({ pickedImgFiles }) => {
        await queryClient.cancelQueries({ queryKey: [QueryKeys.GET_USER_INFO] });
        // TODO
        queryClient
          .setQueryData<GetDetailedUserProfile>
          ([QueryKeys.GET_USER_INFO], (oldState): GetDetailedUserProfile => {
            const newPhotos: Photo[] = pickedImgFiles.map(img => ({ url: img.uri, uuid: uuid.v4() as string }));

            const optimisticState = {
              ...oldState,
              photos: oldState?.photos.concat(newPhotos)

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
