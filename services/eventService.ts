import { GetAllLatestEventsWithPagination, CreateEventLike } from '../models/Event';
import { GetEventByID } from '../models/EventLike';
import { GetLikedEventsForBucketListWithPagination } from '../models/LikedEvent';
import { GetMatchedUsersWhoLikedEventWithPagination } from '../models/User';
import { RestApiService } from './restService';


class EventService extends RestApiService {

  public getAllEventsWithPagination(cursor: number, limit: number, accessToken: string) {
    const params = { cursor, limit };
    const AuthHeaders = this.configAuthHeader(accessToken).headers;
    const config = { params, headers: AuthHeaders };

    return this.http.get<GetAllLatestEventsWithPagination>('/events', config);
  }


  public createOrDeleteLikeByEventID(eventID: number, accessToken: string) {
    return (
      this.http
        .post<{ eventLikedOrDisliked: CreateEventLike }>
        (`/events/${eventID}/like`, null, this.configAuthHeader(accessToken))
    );
  }


  public getLikedEventsForDifferentUsersWithPagination(cursor: number, limit: number, accessToken: string, secondUserId?: number) {
    const params = { cursor, limit, userId: secondUserId };
    const AuthHeaders = this.configAuthHeader(accessToken).headers;
    const config = { params, headers: AuthHeaders };

    return this.http.get<GetLikedEventsForBucketListWithPagination>('/events/liked', config);
  }


  public getEventByID(eventID: number, accessToken: string) {
    return this.http.get<GetEventByID>(`/events/liked/${eventID}`, this.configAuthHeader(accessToken));
  }


  public getAllUsersWhoLikedSameEventWithPagination(eventID: number, cursor: number, limit: number, accessToken: string) {
    const params = { cursor, limit };
    const AuthHeaders = this.configAuthHeader(accessToken).headers;
    const config = { params, headers: AuthHeaders };

    return this.http.get<GetMatchedUsersWhoLikedEventWithPagination>(`/events/liked/${eventID}/users`, config);
  }


  public getMatchedEventsByTwoUsersWithPagination(newPeopleUui: string, cursor: number, limit: number, accessToken: string, allPhotos?: boolean,) {
    const params = { cursor, limit, allPhotos };
    const config = { params, headers: this.configAuthHeader(accessToken).headers };

    return this.http.get<GetLikedEventsForBucketListWithPagination>(`/events/liked/matches/${newPeopleUui}`, config);
  }
}

export default new EventService();
