import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import userService from '../services/userService';
import { GetUserProfile } from '../models/User';
import { QueryKeys } from './queryKeys';
import { useCometaStore } from '../store/cometaStore';
import { ImagePickerAsset } from 'expo-image-picker';


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


type MultiplePhotosParams = { imgFiles: ImagePickerAsset[], userID: number };

export const useMutationUploadUserPhotos = () => {
  const queryClient = useQueryClient();

  return (
    useMutation({
      mutationFn: async ({ imgFiles, userID }: MultiplePhotosParams) => {
        const res = await userService.uploadManyImagesByUserId(userID, imgFiles);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed fech');
        }
      },
      onMutate: async () => { },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USER_INFO] });
      },
      retry: 3,
      retryDelay: 1_000 * 60 * 3
    })
  );
};
