import { ICreateUser, GetBasicUserProfile, GetDetailedUserProfile, GetTargetUser, GetUsersWithPagination, IUserClientState } from '../models/User';
import { RestApiService } from './restService';
import { ImagePickerAsset } from 'expo-image-picker';
import FormData from 'form-data';
import uuid from 'react-native-uuid';
import { Photo } from '../models/Photo';
import { AxiosInstance } from 'axios';


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
  public findUniqueByQueryParams(userFields: Partial<IUserClientState>) {
    return this.http.get<GetBasicUserProfile>('/users', { params: userFields });
  }


  public searchByUsernameWithPagination(username: string, cursor: number, limit = 10) {
    const payload = { params: { username, limit, cursor } };
    return this.http.get<GetUsersWithPagination>('/users/search', payload);
  }


  public create(payload: ICreateUser) {
    return this.http.post<GetBasicUserProfile>('/users', payload);
  }


  /**
   *
   * @param {string} userUuid can be either the loggedInUser or the targetUser
   * @param {string} loggedInUserAccessToken
   * @returns
   */
  public getUserInfoByUidWithLikedEvents(userUuid: string) {
    return this.http.get<GetDetailedUserProfile>(`/users/${userUuid}`);
  }


  /**
 *
 * @param {string} targetUser can be either the loggedInUser or the targetUser
 * @param {string} loggedInUserAccessToken
 * @returns
 */
  public getTargetUserProfile(targetUser: string) {
    return this.http.get<GetTargetUser>(`/users/${targetUser}/targets`,);
  }


  public updateById(loggedInUserID: number, payload: Partial<IUserClientState>) {
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
    return this.http.patch<GetBasicUserProfile>(`/users/${loggedInUserID}`, updatedPayload);
  }


  public delete(loggedInUserID: number) {
    return this.http.delete(`/users/${loggedInUserID}`);
  }


  // public uploadOrUpdateAvatarImgByLoggedInUserID(userID: number, pickedImgFile: ImagePickerAsset) {
  //   const formData = new FormData();
  //   const fileExtension = pickedImgFile.uri.split('.').at(-1);
  //   const headers = { 'Content-Type': 'multipart/form-data', };
  //   const imgFile = {
  //     uri: pickedImgFile.uri,
  //     type: `${pickedImgFile.type}/${fileExtension}`,
  //     name: uuid.v4(),
  //   };
  //   formData.append('file', imgFile);

  //   return this.http.patch<GetBasicUserProfile>(`/users/${userID}/avatar`, formData, { headers });
  // }


  public uploadManyPhotosByLoggedInUserId(loggedInUserID: number, pickedImgFiles: Pick<Photo, 'uuid' | 'url'>[]) {
    const formData = new FormData();
    const headers = { 'Content-Type': 'multipart/form-data', };

    pickedImgFiles.forEach((pickedImgFile, index) => {
      const fileExtension = pickedImgFile.url.split('.').at(-1);
      const imgFile = ({
        uri: pickedImgFile.url,
        type: `image/${fileExtension}`,
        name: pickedImgFile.uuid ?? uuid.v4(),
      });
      formData.append(`files[${index}]`, imgFile);
    });
    return this.http.post<GetBasicUserProfile>(`/users/${loggedInUserID}/photos`, formData, { headers });
  }


  public deletePhotoByUuid(loggedInUserID: number, photoUuid: string) {
    return this.http.delete(`/users/${loggedInUserID}/photos/${photoUuid}`);
  }


  public updateManyPhotosByLoggedInUserId(loggedInUserID: number, pickedImgFiles: ImagePickerAsset[], imgsUuid: string[]) {
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

    return this.http.post<GetBasicUserProfile>(`/users/${loggedInUserID}/photos`, formData, { headers });
  }
}


export default new UsersService();
