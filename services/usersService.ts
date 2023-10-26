import { UserRes } from '../models/User';
import { RestApiService } from './restApiService';
import * as ImagePicker from 'expo-image-picker';
import FormData from 'form-data';


class UserService extends RestApiService {

  public createUser(payload: Partial<UserRes>) {
    const { email, uid, username } = payload;
    return this.http.post<UserRes>('/users', { email, uid, username });
  }

  public deleteUser(userID: number) {
    return this.http.delete(`/users/${userID}`);
  }

  public uploadUserImage(userID: number, imgFile: ImagePicker.ImagePickerAsset) {
    const formData = new FormData();
    const fileExtension = imgFile.uri.split('.').at(-1);
    const headers = { 'Content-Type': 'multipart/form-data', };
    const payload = {
      uri: imgFile.uri,
      type: `${imgFile.type}/${fileExtension}`,
      name: 'imag1j12j1',
    };
    formData.append('file', payload);

    return this.http.patch<UserRes>(`/users/${userID}/avatar`, formData, { headers });
  }
}

export default new UserService();
