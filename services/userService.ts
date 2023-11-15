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


  public uploadImageById(userID: number, imgFile: ImagePickerAsset) {
    const formData = new FormData();
    const fileExtension = imgFile.uri.split('.').at(-1);
    const headers = { 'Content-Type': 'multipart/form-data', };
    const payload = {
      uri: imgFile.uri,
      type: `${imgFile.type}/${fileExtension}`,
      name: uuid.v4(),
    };
    formData.append('file', payload);

    return this.http.patch<UserClientState>(`/users/${userID}/avatar`, formData, { headers });
  }


  public uploadManyImagesByUserId(userID: number, imgFiles: ImagePickerAsset[]) {
    const formData = new FormData();
    const headers = { 'Content-Type': 'multipart/form-data', };
    [...imgFiles].forEach((imgFile) => {
      const fileExtension = imgFile.uri.split('.').at(-1);
      const file = ({
        uri: imgFile.uri,
        type: `${imgFile.type}/${fileExtension}`,
        name: uuid.v4(),
      });

      formData.append('files', file);
    });

    return this.http.patch<GetUserProfile>(`/users/${userID}/photos`, formData, { headers });
  }
}

export default new UserService();
