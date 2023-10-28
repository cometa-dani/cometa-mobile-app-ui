import { EventsListRes } from '../models/Event';
import { RestApiService } from './restService';


class EventService extends RestApiService {

  public getAll(page: number, limit: number, accessToken: string) {
    const params = { page, limit };
    const AuthHeaders = this.configAuthHeader(accessToken).headers;
    const config = { params, headers: AuthHeaders };

    return this.http.get<EventsListRes>('/events', config);
  }
}

export default new EventService();
