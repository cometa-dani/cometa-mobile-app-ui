import { RestApiService } from './restService';
import FormData from 'form-data';
import { AxiosInstance } from 'axios';
import { IPhotoPlaceholder } from '@/components/onboarding/user/photosGrid/photoGrid2';
import {
  ICreateUser,
  IGetBasicUserProfile,
  IGetDetailedUserProfile,
  IGetTargetUser,
  IGetPaginatedUsers,
  IUserOnboarding,
  IUpdateUser
} from '../models/User';


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

  public uploadUserPhotos(userId: number, pickedAssets: IPhotoPlaceholder[]) {
    const formData = new FormData();
    const headers = { 'Content-Type': 'multipart/form-data', };
    pickedAssets.forEach((pickedImgFile, index) => {
      const fileExtension = pickedImgFile.fromFileSystem?.uri.split('.').at(-1) ?? 'png';
      console.log(pickedImgFile.fromFileSystem?.uri);
      const imgFile = ({
        uri: pickedImgFile.fromFileSystem?.uri,
        type: pickedImgFile.fromFileSystem?.mimeType ?? `image/${fileExtension}`,
        name: pickedImgFile.fromFileSystem?.fileName ?? index,
      });
      formData.append(`files[${index}]`, imgFile);
    });
    return this.http.post<IGetBasicUserProfile>(`/users/${userId}/photos`, formData, { headers });
  }

  public deletePhotoById(loggedInUserID: number, photoId: number | string) {
    return this.http.delete(`/users/${loggedInUserID}/photos/${photoId}`);
  }

  public updateUserPhoto(userId: number, pickedAsset: IPhotoPlaceholder) {
    const formData = new FormData();
    const headers = { 'Content-Type': 'multipart/form-data' };
    const fileExtension = pickedAsset?.fromFileSystem?.uri.split('.').at(-1) ?? 'png';
    const imgFile = ({
      uri: pickedAsset.fromFileSystem?.uri,
      type: pickedAsset.fromFileSystem?.mimeType ?? `image/${fileExtension}`,
      name: pickedAsset.fromFileSystem?.fileName ?? pickedAsset.fromBackend?.order,
    });
    formData.append('file', imgFile);
    return this.http.patch<IGetBasicUserProfile>(`/users/${userId}/photos/${pickedAsset.fromBackend?.id}`, formData, { headers });
  }
}


export default new UsersService();
