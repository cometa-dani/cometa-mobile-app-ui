import { EventsListRes, LikeEvent } from '../models/Event';
import { RestApiService } from './restService';


class EventService extends RestApiService {

  public getAll(page: number, limit: number, accessToken: string) {
    const params = { page, limit };
    const AuthHeaders = this.configAuthHeader(accessToken).headers;
    const config = { params, headers: AuthHeaders };

    return this.http.get<EventsListRes>('/events', config);
  }

  public createOrDeleteLikeByEventID(eventID: number, accessToken: string) {
    return (
      this.http
        .post<{ eventLikedOrDisliked: LikeEvent }>
        (`/events/${eventID}/like`, null, this.configAuthHeader(accessToken))
    );
  }
}

export default new EventService();
