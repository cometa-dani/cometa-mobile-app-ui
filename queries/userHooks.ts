import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import userService from '../services/userService';
import { GetUserProfile, Photo } from '../models/User';
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
      queryFn: async (): Promise<GetUserProfile> => {
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


type MultiplePhotosParams = { pickedImgFiles: ImagePickerAsset[], userID: number };

export const useMutationUploadUserPhotos = () => {
  const queryClient = useQueryClient();

  return (
    useMutation({
      mutationFn: async ({ userID, pickedImgFiles }: MultiplePhotosParams) => {
        const res = await userService.uploadManyImagesByUserId(userID, pickedImgFiles);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed fech');
        }
      },
      onMutate: async ({ pickedImgFiles }) => {
        // TODO
        queryClient
          .setQueryData<GetUserProfile>
          ([QueryKeys.GET_USER_INFO], (oldState): GetUserProfile => {
            const newPhotos: Photo[] = pickedImgFiles.map(img => ({ url: img.uri, uuid: uuid.v4() as string }));

            const optimisticState = {
              ...oldState,
              photos: oldState?.photos.concat(newPhotos)

            } as GetUserProfile;

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
