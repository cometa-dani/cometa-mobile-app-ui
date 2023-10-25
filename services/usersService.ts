import { UserRes } from '../models/User';
import { RestApiService } from './restApiService';
import * as ImagePicker from 'expo-image-picker';
// import { randomUUID } from 'crypto';

import FormData from 'form-data';


class UserService extends RestApiService {

  public createUser(payload: Partial<UserRes>) {
    const { email, uid, username } = payload;
    return this.http.post<UserRes>('/users', { email, uid, username });
  }

  public uploadUserImage(userID: number, imgFile: ImagePicker.ImagePickerAsset) {
    const form = new FormData();
    const payload = {
      uri: imgFile.uri,
      type: imgFile.type, // Adjust the content type based on your image type
      name: 'ask1k', // Adjust the file name as needed
    };
    form.append('file', payload);
    console.log(payload, userID);
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    };
    return this.http.patch<UserRes>(`/users/${userID}/avatar`, form, { headers });
  }
}

export default new UserService();
