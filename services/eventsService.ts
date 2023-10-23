import { EventsListRes } from '../models/Event';
import { RestApiService } from './restApiService';


class EventsService extends RestApiService {

  getEvents(page: number, limit: number) {
    const params = { params: { page, limit } };
    return this.http.get<EventsListRes>('/events', params);
  }
}

export default new EventsService();
