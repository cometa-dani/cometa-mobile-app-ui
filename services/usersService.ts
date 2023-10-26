import { UserRes } from '../models/User';
import { RestApiService } from './restApiService';
import * as ImagePicker from 'expo-image-picker';
import FormData from 'form-data';


class UserService extends RestApiService {

  public createUser(payload: Partial<UserRes>) {
    const { email, username } = payload;
    return this.http.post<UserRes>('/users', { email, username });
  }

  public updateUser(userID: number, payload: Partial<UserRes>) {
    return this.http.patch<UserRes>(`/users/${userID}`, payload);
  }

  public deleteUser(userID: number) {
    return this.http.delete(`/users/${userID}`);
  }

  public uploadUserImage(userID: number, imgFile: ImagePicker.ImagePickerAsset, fileName: string) {
    const formData = new FormData();
    const fileExtension = imgFile.uri.split('.').at(-1);
    const headers = { 'Content-Type': 'multipart/form-data', };
    const payload = {
      uri: imgFile.uri,
      type: `${imgFile.type}/${fileExtension}`,
      name: fileName,
    };
    formData.append('file', payload);

    return this.http.patch<UserRes>(`/users/${userID}/avatar`, formData, { headers });
  }
}

export default new UserService();
