import { UserClientState } from '../models/User';
import { RestApiService } from './restService';
import * as ImagePicker from 'expo-image-picker';
import FormData from 'form-data';


class UserService extends RestApiService {

  public create(payload: Partial<UserClientState>) {
    const { email, username } = payload;
    return this.http.post<UserClientState>('/users', { email, username });
  }

  public getUserInfoByUid(uid: string) {
    return this.http.get<UserClientState>(`/users/${uid}`);
  }

  public updateById(userID: number, payload: Partial<UserClientState>) {
    return this.http.patch<UserClientState>(`/users/${userID}`, payload);
  }

  public delete(userID: number) {
    return this.http.delete(`/users/${userID}`);
  }

  public uploadImageById(userID: number, imgFile: ImagePicker.ImagePickerAsset, fileName: string) {
    const formData = new FormData();
    const fileExtension = imgFile.uri.split('.').at(-1);
    const headers = { 'Content-Type': 'multipart/form-data', };
    const payload = {
      uri: imgFile.uri,
      type: `${imgFile.type}/${fileExtension}`,
      name: fileName,
    };
    formData.append('file', payload);

    return this.http.patch<UserClientState>(`/users/${userID}/avatar`, formData, { headers });
  }
}

export default new UserService();
