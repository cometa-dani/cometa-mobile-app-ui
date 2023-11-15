import { GetUserProfile, UserClientState } from '../models/User';
import { RestApiService } from './restService';
import { ImagePickerAsset } from 'expo-image-picker';
import FormData from 'form-data';
import uuid from 'react-native-uuid';


class UserService extends RestApiService {

  public create(payload: Partial<UserClientState>) {
    const { email, username } = payload;
    return this.http.post<UserClientState>('/users', { email, username });
  }


  public getUserInfoByUid(uid: string, accessToken: string) {
    return this.http.get<GetUserProfile>(`/users/${uid}`, this.configAuthHeader(accessToken));
  }


  public updateById(userID: number, payload: Partial<UserClientState>) {
    return this.http.patch<UserClientState>(`/users/${userID}`, payload);
  }


  public delete(userID: number) {
    return this.http.delete(`/users/${userID}`);
  }


  public uploadImageById(userID: number, pickedImgFile: ImagePickerAsset) {
    const formData = new FormData();
    const fileExtension = pickedImgFile.uri.split('.').at(-1);
    const headers = { 'Content-Type': 'multipart/form-data', };
    const imgFile = {
      uri: pickedImgFile.uri,
      type: `${pickedImgFile.type}/${fileExtension}`,
      name: uuid.v4(),
    };
    formData.append('file', imgFile);

    return this.http.patch<UserClientState>(`/users/${userID}/avatar`, formData, { headers });
  }


  public uploadManyImagesByUserId(userID: number, pickedImgFiles: ImagePickerAsset[]) {
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

    return this.http.patch<GetUserProfile>(`/users/${userID}/photos`, formData, { headers });
  }
}

export default new UserService();
