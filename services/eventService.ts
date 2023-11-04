import { GetLatestEventsWithPagination, CreateEventLike } from '../models/Event';
import { GetLikedEventByID } from '../models/EventLike';
import { GetAllLikedEventsWithPagination } from '../models/LikedEvents';
import { GetUsersWhoLikedEventWithPagination } from '../models/User';
import { RestApiService } from './restService';


class EventService extends RestApiService {

  public getAll(cursor: number, limit: number, accessToken: string) {
    const params = { cursor, limit };
    const AuthHeaders = this.configAuthHeader(accessToken).headers;
    const config = { params, headers: AuthHeaders };

    return this.http.get<GetLatestEventsWithPagination>('/events', config);
  }


  public createOrDeleteLikeByEventID(eventID: number, accessToken: string) {
    return (
      this.http
        .post<{ eventLikedOrDisliked: CreateEventLike }>
        (`/events/${eventID}/like`, null, this.configAuthHeader(accessToken))
    );
  }


  public getAllLikedEvents(page: number, limit: number, accessToken: string) {
    const params = { page, limit };
    const AuthHeaders = this.configAuthHeader(accessToken).headers;
    const config = { params, headers: AuthHeaders };

    return this.http.get<GetAllLikedEventsWithPagination>('/events/liked', config);
  }


  public getLikedEventByID(eventID: number, accessToken: string) {
    return this.http.get<GetLikedEventByID>(`/events/liked/${eventID}`, this.configAuthHeader(accessToken));
  }


  public getUsersWhoLikedSameEvent(eventID: number, page: number, limit: number, accessToken: string) {
    const params = { page, limit };
    const AuthHeaders = this.configAuthHeader(accessToken).headers;
    const config = { params, headers: AuthHeaders };

    return this.http.get<GetUsersWhoLikedEventWithPagination>(`/events/liked/${eventID}/users`, config);
  }
}

export default new EventService();
