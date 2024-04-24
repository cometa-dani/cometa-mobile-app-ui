import { GetBasicUserProfile, GetDetailedUserProfile, GetUsersWithPagination, LoggedUserClientState } from '../models/User';
import { RestApiService } from './restService';
import { ImagePickerAsset } from 'expo-image-picker';
import FormData from 'form-data';
import uuid from 'react-native-uuid';
import { Photo } from '../models/Photo';


type CreateUser = Pick<LoggedUserClientState, (
  'uid' |
  'email' |
  'username' |
  'name' |
  'birthday'
)>


class UsersService extends RestApiService {

  /**
   * TODO:
   *
   * @param userFields  can be either the loggedInUser or the targetUser
   * @returns
   */
  public findUniqueByQueryParams(userFields: Partial<LoggedUserClientState>) {
    return this.http.get<GetBasicUserProfile>('/users', { params: userFields });
  }


  public searchByUsernameWithPagination(username: string, cursor: number, limit = 10,) {
    return this.http.get<GetUsersWithPagination>('/users/search', { params: { username, limit, cursor } });
  }


  public create(payload: CreateUser) {
    return this.http.post<GetBasicUserProfile>('/users', payload);
  }


  /**
   *
   * @param {string} userUuid can be either the loggedInUser or the targetUser
   * @param {string} loggedInUserAccessToken
   * @returns
   */
  public getUserInfoByUidWithFriendShips(userUuid: string, loggedInUserAccessToken: string) {
    return this.http.get<GetDetailedUserProfile>(`/users/${userUuid}`, this.configAuthHeader(loggedInUserAccessToken));
  }


  public updateById(loggedInUserID: number, payload: Partial<LoggedUserClientState>) {
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


  public uploadOrUpdateAvatarImgByLoggedInUserID(userID: number, pickedImgFile: ImagePickerAsset) {
    const formData = new FormData();
    const fileExtension = pickedImgFile.uri.split('.').at(-1);
    const headers = { 'Content-Type': 'multipart/form-data', };
    const imgFile = {
      uri: pickedImgFile.uri,
      type: `${pickedImgFile.type}/${fileExtension}`,
      name: uuid.v4(),
    };
    formData.append('file', imgFile);

    return this.http.patch<GetBasicUserProfile>(`/users/${userID}/avatar`, formData, { headers });
  }


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
      // Include the order in the field name
      // formData.append(`files[${order}]`, imgFile);

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
