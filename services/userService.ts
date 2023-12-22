import { GetBasicUserProfile, GetDetailedUserProfile, UserClientState } from '../models/User';
import { RestApiService } from './restService';
import { ImagePickerAsset } from 'expo-image-picker';
import FormData from 'form-data';
import uuid from 'react-native-uuid';


class UserService extends RestApiService {

  public getUsersWithFilters(userFields: Partial<UserClientState>) {
    type Res = GetBasicUserProfile[] | GetBasicUserProfile | null;
    return this.http.get<Res>('/users', { params: userFields });
  }


  public create(payload: Partial<UserClientState>) {
    const { email, username } = payload;
    return this.http.post<GetBasicUserProfile>('/users', { email, username });
  }


  public getUserInfoByUid(uid: string, accessToken: string) {
    return this.http.get<GetDetailedUserProfile>(`/users/${uid}`, this.configAuthHeader(accessToken));
  }


  public updateById(userID: number, payload: Partial<UserClientState>) {
    return this.http.patch<GetBasicUserProfile>(`/users/${userID}`, payload);
  }


  public delete(userID: number) {
    return this.http.delete(`/users/${userID}`);
  }


  public uploadOrUpdateAvatarImgByUserID(userID: number, pickedImgFile: ImagePickerAsset) {
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


  public uploadManyPhotosByUserId(userID: number, pickedImgFiles: ImagePickerAsset[]) {
    const formData = new FormData();
    const headers = { 'Content-Type': 'multipart/form-data', };

    pickedImgFiles.forEach((pickedImgFile) => {
      const fileExtension = pickedImgFile.uri.split('.').at(-1);
      const imgFile = ({
        uri: pickedImgFile.uri,
        type: `${pickedImgFile.type}/${fileExtension}`,
        name: uuid.v4(),
      });

      formData.append('files', imgFile);
    });
    // console.log(formData);
    return this.http.post<GetBasicUserProfile>(`/users/${userID}/photos`, formData, { headers });
  }


  public deletePhotoByUuid(userID: number, photoUuid: string) {
    return this.http.delete(`/users/${userID}/photos/${photoUuid}`);
  }


  public updateManyPhotosByUserId(userID: number, pickedImgFiles: ImagePickerAsset[], imgsUuid: string[]) {
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

    return this.http.post<GetBasicUserProfile>(`/users/${userID}/photos`, formData, { headers });
  }
}


export default new UserService();
