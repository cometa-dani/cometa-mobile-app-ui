import { EventsListRes } from '../models/Event';
import { RestApiService } from './restApiService';


class EventService extends RestApiService {

  public getEvents(page: number, limit: number, accessToken: string) {
    const params = { page, limit };
    const headers = this.configAuthHeader(accessToken).headers;
    const config = { params, headers };

    return this.http.get<EventsListRes>('/events', config);
  }
}

export default new EventService();
