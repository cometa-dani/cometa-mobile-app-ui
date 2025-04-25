import FormData from 'form-data';
import { AxiosInstance } from 'axios';
import { IPhotoPlaceholder } from '@/components/onboarding/photosGrid/photoGrid';
// import {
//   ICreateUser,
//   IGetBasicUserProfile,
//   IGetDetailedUserProfile,
//   IGetTargetUser,
//   IGetPaginatedUsers,
//   IUserOnboarding,
//   IUpdateUser
// } from '../models/User';
import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';
import { RestApiService } from '../restService';
import { ICompany, ICompanyCreate } from '@/models/company/Company';


class CompanyService {
  private http: AxiosInstance;

  constructor() {
    this.http = RestApiService.getInstance().http;
  }

  // /**
  //  * TODO:
  //  *
  //  * @param userFields  can be either the loggedInUser or the targetUser
  //  * @returns
  //  */
  // public findUniqueByQueryParams(userFields: Partial<IUserOnboarding>) {
  //   return this.http.get<IGetBasicUserProfile>('/users', { params: userFields });
  // }

  // public searchByUsernameWithPagination(username: string, cursor: number, limit = 10) {
  //   const payload = { params: { username, limit, cursor } };
  //   return this.http.get<IGetPaginatedUsers>('/users/search', payload);
  // }

  public create(payload: ICompanyCreate) {
    return this.http.post<ICompany>('/organizations', payload);
  }

  // public updateById(loggedInUserID: number, payload: Partial<IUpdateUser>) {
  //   return this.http.patch<IGetBasicUserProfile>(`/organizations/${loggedInUserID}`, payload);
  // }

  /**
   *
   * @param {string} uuid can be either the loggedInUser or the targetUser
   * @param {string} loggedInUserAccessToken
   * @returns
   */
  public getCurentUserProfile(uuid: string) {
    return this.http.get<ICompany>(`/organizations/${uuid}`);
  }

  //   /**
  //  *
  //  * @param {string} uuid can be either the loggedInUser or the targetUser
  //  * @param {string} loggedInUserAccessToken
  //  * @returns
  //  */
  //   public getTargetUserProfile(uuid: string) {
  //     return this.http.get<IGetTargetUser>(`/organizations/${uuid}/targets`,);
  //   }

  //   public deleteUserById(loggedInUserID: number) {
  //     return this.http.delete(`/organizations/${loggedInUserID}`);
  //   }

  public async uploadUserPhotos(userId: number, pickedAssets: IPhotoPlaceholder[]) {
    const formData = new FormData();
    pickedAssets.forEach((pickedImgFile) => {
      const uri = pickedImgFile.fromFileSystem?.uri ?? '';
      const mimeType = pickedImgFile.fromFileSystem?.mimeType ?? '';
      const fileExtension = uri.split('.').at(-1);
      const filename = pickedImgFile.fromFileSystem?.fileName ?? '';
      formData.append('files', {
        uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
        name: filename || Crypto.randomUUID(),
        type: mimeType || `image/${fileExtension}`,
      });
    });
    return (
      this.http.post<ICompany>(`/organizations/${userId}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: () => {
          return formData; // this is doing the trick
        }
      })
    );
  }

  // public updateUserPhoto(userId: number, pickedAsset: IPhotoPlaceholder) {
  //   const formData = new FormData();
  //   const uri = pickedAsset.fromFileSystem?.uri ?? '';
  //   const mimeType = pickedAsset.fromFileSystem?.mimeType ?? '';
  //   const fileExtension = uri.split('.').at(-1);
  //   const filename = pickedAsset.fromFileSystem?.fileName ?? '';
  //   formData.append('file', {
  //     uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
  //     name: filename || Crypto.randomUUID(),
  //     type: mimeType || `image/${fileExtension}`,
  //   });
  //   return (
  //     this.http.patch<IGetBasicUserProfile>(
  //       `/organizations/${userId}/photos/${pickedAsset.fromBackend?.id}`,
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //         transformRequest: () => {
  //           return formData;
  //         }
  //       })
  //   );
  // }

  // public deletePhotoById(loggedInUserID: number, photoId: number | string) {
  //   return this.http.delete(`/organizations/${loggedInUserID}/photos/${photoId}`);
  // }

  // public async getUserWhoLikedSameEventById(eventId: number, cursor: number, limit: number) {
  //   return this.http.get('organizations/liked-same-event', { params: { eventId, cursor, limit } });
  // }
}


export const companyService = new CompanyService();
