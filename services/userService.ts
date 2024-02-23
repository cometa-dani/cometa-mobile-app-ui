import { GetBasicUserProfile, GetDetailedUserProfile, LoggedUserClientState } from '../models/User';
import { RestApiService } from './restService';
import { ImagePickerAsset } from 'expo-image-picker';
import FormData from 'form-data';
import uuid from 'react-native-uuid';


class UsersService extends RestApiService {

  /**
   *
   * @param userFields  can be either the loggedInUser or the targetUser
   * @returns
   */
  public getUsersWithFilters(userFields: Partial<LoggedUserClientState>) {
    type Res = GetBasicUserProfile[] | GetBasicUserProfile | null;
    return this.http.get<Res>('/users', { params: userFields });
  }


  public create(payload: Partial<LoggedUserClientState>) {
    const { email, username } = payload;
    return this.http.post<GetBasicUserProfile>('/users', { email, username });
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


  public uploadManyPhotosByLoggedInUserId(loggedInUserID: number, pickedImgFiles: Pick<ImagePickerAsset, 'uri' | 'assetId'>[]) {
    const formData = new FormData();
    const headers = { 'Content-Type': 'multipart/form-data', };

    pickedImgFiles.forEach((pickedImgFile) => {
      const fileExtension = pickedImgFile.uri.split('.').at(-1);
      const imgFile = ({
        uri: pickedImgFile.uri,
        type: `image/${fileExtension}`,
        name: pickedImgFile.assetId ?? uuid.v4(),
      });
      // Include the order in the field name
      // formData.append(`files[${order}]`, imgFile);

      formData.append('files', imgFile);
    });
    // console.log(formData);
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
