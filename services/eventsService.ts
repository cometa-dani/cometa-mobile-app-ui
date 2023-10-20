import { EventsListRes } from '../models/Event';
import { RestApiService } from './restApiService';


class EventsService extends RestApiService {

  getEvents(page = 1, limit = 5) {
    const params = { params: { page, limit } };
    return this.http.get<EventsListRes>('/events', params);
  }
}

export default new EventsService();
