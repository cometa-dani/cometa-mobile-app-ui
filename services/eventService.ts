import { GetLikedEventById, GetLatestEvents, CreateLikedEvent } from '../models/Event';
import { GetAllLikedEvents } from '../models/LikedEvents';
import { GetUserWhoLikedEvent } from '../models/User';
import { RestApiService } from './restService';


class EventService extends RestApiService {

  public getAll(cursor: number, limit: number, accessToken: string) {
    const params = { cursor, limit };
    const AuthHeaders = this.configAuthHeader(accessToken).headers;
    const config = { params, headers: AuthHeaders };

    return this.http.get<GetLatestEvents>('/events', config);
  }


  public createOrDeleteLikeByEventID(eventID: number, accessToken: string) {
    return (
      this.http
        .post<{ eventLikedOrDisliked: CreateLikedEvent }>
        (`/events/${eventID}/like`, null, this.configAuthHeader(accessToken))
    );
  }


  public getAllLikedEvents(page: number, limit: number, accessToken: string) {
    const params = { page, limit };
    const AuthHeaders = this.configAuthHeader(accessToken).headers;
    const config = { params, headers: AuthHeaders };

    return this.http.get<GetAllLikedEvents>('events/liked', config);
  }


  public getLikedEventByID(eventID: number, accessToken: string) {
    return this.http.get<GetLikedEventById>(`events/liked/${eventID}`, this.configAuthHeader(accessToken));
  }


  public getUsersWhoLikedSameEvent(eventID: number, page: number, limit: number, accessToken: string) {
    const params = { page, limit };
    const AuthHeaders = this.configAuthHeader(accessToken).headers;
    const config = { params, headers: AuthHeaders };

    return this.http.get<GetUserWhoLikedEvent>(`events/liked/${eventID}/users`, config);
  }
}

export default new EventService();
