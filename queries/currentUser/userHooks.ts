import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import userService from '../../services/userService';
import { GetBasicUserProfile, GetDetailedUserProfile, ICreateUser, IUpdateUser, IUserClientState } from '../../models/User';
import { Photo } from '../../models/Photo';
import { QueryKeys } from '../queryKeys';
import { useCometaStore } from '../../store/cometaStore';
import { IPhotoPlaceholder } from '@/components/onboarding/bottomSheet/photosGrid/photosGrid';


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
          .setQueryData<GetDetailedUserProfile>
          ([QueryKeys.GET_LOGGED_IN_USER_INFO_PROFILE, uuid], (oldState): GetDetailedUserProfile => {
            const optimisticState = {
              ...oldState,
              ...payload
            } as GetDetailedUserProfile;

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


export const useQueryGetUserByUid = (dynamicParam: string) => {
  return (
    useQuery({
      enabled: !!dynamicParam,
      queryKey: [QueryKeys.GET_LOGGED_IN_USER_INFO_PROFILE, dynamicParam],
      queryFn: async (): Promise<GetDetailedUserProfile> => {
        const res = await userService.getUserInfoByUidWithLikedEvents(dynamicParam);
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
  userID: number
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
        async ({ userID, pickedImgFiles }: PhotosParams): Promise<GetBasicUserProfile> => {
          const res = await userService.uploadUserPhotos(userID, pickedImgFiles);
          if (res.status === 200) {
            return res.data;
          }
          else {
            throw new Error('failed fech');
          }
        },
      onMutate: async ({ pickedImgFiles }) => {
        await queryClient.cancelQueries({ queryKey: [QueryKeys.GET_LOGGED_IN_USER_INFO_PROFILE, uuId] });
        queryClient
          .setQueryData<GetDetailedUserProfile>
          ([QueryKeys.GET_LOGGED_IN_USER_INFO_PROFILE, uuId], (oldState): GetDetailedUserProfile => {

            const optimisticState = {
              ...oldState,
              photos: [...(oldState?.photos || []), ...pickedImgFiles]

            } as GetDetailedUserProfile;

            return optimisticState;
          });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_LOGGED_IN_USER_INFO_PROFILE, uuId] });
      },
      retry: 2,
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
        async ({ userID, photoUuid }: DeletePhotoArgs): Promise<GetBasicUserProfile> => {
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
          .setQueryData<GetDetailedUserProfile>
          ([QueryKeys.GET_LOGGED_IN_USER_INFO_PROFILE, dynamicParam], (oldState): GetDetailedUserProfile => {
            const filteredPhotos: Photo[] = oldState?.photos.filter(({ uuid }) => photoUuid !== uuid) || [];

            const optimisticState = {
              ...oldState,
              photos: filteredPhotos

            } as GetDetailedUserProfile;

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


// type AvatarParams = { pickedImgFile: ImagePickerAsset, userID: number };

// export const useMutationUpdateLoggedInUserAvatar = (dynamicParam: string) => {
//   const queryClient = useQueryClient();

//   return (
//     useMutation({
//       mutationFn:
//         async ({ userID, pickedImgFile }: AvatarParams): Promise<GetBasicUserProfile> => {
//           const res = await userService.uploadOrUpdateAvatarImgByLoggedInUserID(userID, pickedImgFile);
//           if (res.status === 200) {
//             return res.data;
//           }
//           else {
//             throw new Error('failed fech');
//           }
//         },

//       onMutate: async ({ pickedImgFile }) => {
//         await queryClient.cancelQueries({ queryKey: [QueryKeys.GET_LOGGED_IN_USER_INFO_PROFILE, dynamicParam] });

//         queryClient
//           .setQueryData<GetDetailedUserProfile>
//           ([QueryKeys.GET_LOGGED_IN_USER_INFO_PROFILE, dynamicParam], (oldState): GetDetailedUserProfile => {

//             const optimisticState = {
//               ...oldState,
//               avatar: pickedImgFile.uri

//             } as GetDetailedUserProfile;

//             return optimisticState;
//           });
//       },

//       onSuccess: async () => {
//         await queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_LOGGED_IN_USER_INFO_PROFILE, dynamicParam] });
//       },
//       retry: 2,
//       retryDelay: 1_000 * 6
//     })
//   );
// };
