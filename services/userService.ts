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
      const fileExtension = pickedImgFile.pickedUpAsset?.uri.split('.').at(-1) ?? 'png';
      const imgFile = ({
        uri: pickedImgFile.pickedUpAsset?.uri,
        type: pickedImgFile.pickedUpAsset?.mimeType ?? `image/${fileExtension}`,
        name: pickedImgFile.pickedUpAsset?.fileName ?? pickedAssets,
      });
      formData.append(`files[${index}]`, imgFile);
    });
    return this.http.post<IGetBasicUserProfile>(`/users/${userId}/photos`, formData, { headers });
  }

  public deletePhotoById(loggedInUserID: number, photoId: number | string) {
    return this.http.delete(`/users/${loggedInUserID}/photos/${photoId}`);
  }

  public updateUserPhoto(userId: number, photoId: number, pickedAsset: IPhotoPlaceholder) {
    const formData = new FormData();
    const headers = { 'Content-Type': 'multipart/form-data' };
    const fileExtension = pickedAsset?.pickedUpAsset?.uri.split('.').at(-1) ?? 'png';
    const imgFile = ({
      uri: pickedAsset.pickedUpAsset?.uri,
      type: pickedAsset.pickedUpAsset?.mimeType ?? `image/${fileExtension}`,
      name: pickedAsset.pickedUpAsset?.fileName ?? photoId,
    });
    formData.append('file', imgFile);
    return this.http.patch<IGetBasicUserProfile>(`/users/${userId}/photos/${photoId}`, formData, { headers });
  }
}


export default new UsersService();
