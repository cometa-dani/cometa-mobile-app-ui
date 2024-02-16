import { GetAllLatestEventsWithPagination, CreateEventLike, MatchedEvents } from '../models/Event';
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


  public getLikedEventsForBucketListWithPagination(cursor: number, limit: number, accessToken: string, allPhotos?: boolean) {
    const params = { cursor, limit, allPhotos };
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


  public getMatchedEventsByTwoUsers(newPeopleUui: string, take: number, accessToken: string) {
    return this.http.get<MatchedEvents[]>(`/events/liked/matches/${newPeopleUui}?limit=${take}`, this.configAuthHeader(accessToken));
  }
}

export default new EventService();
