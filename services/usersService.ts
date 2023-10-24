import { RestApiService } from './restApiService';


class UserService extends RestApiService {

  public createUser(payload: object) {
    return this.http.post('/users', payload);
  }
}

export default new UserService();
