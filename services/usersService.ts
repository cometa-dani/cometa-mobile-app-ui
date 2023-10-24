import { UserRes } from 'models/User';
import { RestApiService } from './restApiService';


class UserService extends RestApiService {

  public createUser(payload: Partial<UserRes>) {
    return this.http.post<UserRes>('/users', payload);
  }
}

export default new UserService();
