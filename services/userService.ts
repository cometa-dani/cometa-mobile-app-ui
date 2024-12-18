import { RestApiService } from './restService';
import FormData from 'form-data';
import { AxiosInstance } from 'axios';
import { IPhotoPlaceholder } from '@/components/onboarding/user/photosGrid/photoGrid';
import {
  ICreateUser,
  IGetBasicUserProfile,
  IGetDetailedUserProfile,
  IGetTargetUser,
  IGetPaginatedUsers,
  IUserOnboarding,
  IUpdateUser
} from '../models/User';
import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';
// const FormData = globalThis.FormData;


class UsersService {
  private http: AxiosInstance;

  constructor() {
    this.http = RestApiService.getInstance().http;
  }

  /**
   * TODO:
   *
   * @param userFields  can be either the loggedInUser or the targetUser
   * @returns
   */
  public findUniqueByQueryParams(userFields: Partial<IUserOnboarding>) {
    return this.http.get<IGetBasicUserProfile>('/users', { params: userFields });
  }

  public searchByUsernameWithPagination(username: string, cursor: number, limit = 10) {
    const payload = { params: { username, limit, cursor } };
    return this.http.get<IGetPaginatedUsers>('/users/search', payload);
  }

  public create(payload: ICreateUser) {
    return this.http.post<IGetBasicUserProfile>('/users', payload);
  }

  public updateById(loggedInUserID: number, payload: Partial<IUpdateUser>) {
    return this.http.patch<IGetBasicUserProfile>(`/users/${loggedInUserID}`, payload);
  }

  /**
   *
   * @param {string} userUuid can be either the loggedInUser or the targetUser
   * @param {string} loggedInUserAccessToken
   * @returns
   */
  public getUserInfoByUidWithLikedEvents(userUuid: string) {
    return this.http.get<IGetDetailedUserProfile>(`/users/${userUuid}`);
  }

  /**
 *
 * @param {string} targetUser can be either the loggedInUser or the targetUser
 * @param {string} loggedInUserAccessToken
 * @returns
 */
  public getTargetUserProfile(targetUser: string) {
    return this.http.get<IGetTargetUser>(`/users/${targetUser}/targets`,);
  }

  public deleteUserById(loggedInUserID: number) {
    return this.http.delete(`/users/${loggedInUserID}`);
  }

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
      this.http.post<IGetBasicUserProfile>(`/users/${userId}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: () => {
          return formData; // this is doing the trick
        }
      })
    );
  }

  public updateUserPhoto(userId: number, pickedAsset: IPhotoPlaceholder) {
    const formData = new FormData();
    const uri = pickedAsset.fromFileSystem?.uri ?? '';
    const mimeType = pickedAsset.fromFileSystem?.mimeType ?? '';
    const fileExtension = uri.split('.').at(-1);
    const filename = pickedAsset.fromFileSystem?.fileName ?? '';
    formData.append('file', {
      uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
      name: filename || Crypto.randomUUID(),
      type: mimeType || `image/${fileExtension}`,
    });
    return (
      this.http.patch<IGetBasicUserProfile>(
        `/users/${userId}/photos/${pickedAsset.fromBackend?.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: () => {
            return formData;
          }
        })
    );
  }

  public deletePhotoById(loggedInUserID: number, photoId: number | string) {
    return this.http.delete(`/users/${loggedInUserID}/photos/${photoId}`);
  }
}


export default new UsersService();
