import { ICreateUser, IGetBasicUserProfile, IGetDetailedUserProfile, IGetTargetUser, IGetPaginatedUsers, IUserOnboarding, IUpdateUser } from '../models/User';
import { RestApiService } from './restService';
import { ImagePickerAsset } from 'expo-image-picker';
import FormData from 'form-data';
import { AxiosInstance } from 'axios';
import { IPhotoPlaceholder } from '@/components/onboarding/user/photosGrid/photosGrid';


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
    let updatedPayload;

    if (payload.languages?.length) {
      updatedPayload = {
        ...payload,
        languages: (payload.languages as string[]).join(',')
      };
    }
    else {
      updatedPayload = payload;
    }
    return this.http.patch<IGetBasicUserProfile>(`/users/${loggedInUserID}`, updatedPayload);
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

  public uploadUserPhotos(userId: number, pickedImgFiles: IPhotoPlaceholder[]) {
    const formData = new FormData();
    const headers = { 'Content-Type': 'multipart/form-data', };

    pickedImgFiles.forEach((pickedImgFile, index) => {
      const fileExtension = pickedImgFile.asset?.uri.split('.').at(-1);
      const imgFile = ({
        uri: pickedImgFile.asset?.uri,
        type: `image/${fileExtension}`,
        name: pickedImgFile.asset?.fileName ?? index,
      });
      formData.append(`files[${index}]`, imgFile);
    });
    return this.http.post<IGetBasicUserProfile>(`/users/${userId}/photos`, formData, { headers });
  }

  public deletePhotoById(loggedInUserID: number, photoId: number | string) {
    return this.http.delete(`/users/${loggedInUserID}/photos/${photoId}`);
  }

  public updateUserPhotos(loggedInUserID: number, pickedImgFiles: ImagePickerAsset[], imgsUuid: string[]) {
    const formData = new FormData();
    const headers = { 'Content-Type': 'multipart/form-data', };

    pickedImgFiles.forEach((pickedImgFile, i) => {
      const fileExtension = pickedImgFile.uri.split('.').at(-1);
      const imgFile = ({
        uri: pickedImgFile.uri,
        type: `${pickedImgFile.type}/${fileExtension}`,
        name: imgsUuid[i],
      });

      formData.append('files', imgFile);
    });
    return this.http.patch<IGetBasicUserProfile>(`/users/${loggedInUserID}/photos`, formData, { headers });
  }
}


export default new UsersService();
