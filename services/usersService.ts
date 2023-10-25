import { UserRes } from 'models/User';
import { RestApiService } from './restApiService';
import * as ImagePicker from 'expo-image-picker';

import FormData from 'form-data';


class UserService extends RestApiService {

  public createUser(payload: Partial<UserRes>) {
    return this.http.post<UserRes>('/users', payload);
  }

  public uploadUserImage(userID: number, imgFile: ImagePicker.ImagePickerAsset) {
    const form = new FormData();
    form.append(
      'file',
      {
        uri: imgFile.uri,
        type: imgFile.type, // Adjust the content type based on your image type
        name: imgFile.fileName, // Adjust the file name as needed
      }
    );
    return this.http.post(`/users/${userID}/img`, form);
  }
}

export default new UserService();
