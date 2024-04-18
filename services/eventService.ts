import { GetAllLatestEventsWithPagination, CreateEventLike, EventCategory } from '../models/Event';
import { GetEventByID } from '../models/EventLike';
import { GetLikedEventsForBucketListWithPagination } from '../models/LikedEvent';
import { GetMatchedUsersWhoLikedEventWithPagination } from '../models/User';
import { RestApiService } from './restService';


class EventService extends RestApiService {


  private _parseCategories = (params: object) => {
    return (
      Object
        .values(params)
        .filter(val => val)
        .reduce(
          (prev, curr) => (
            prev ? prev?.concat(`,${curr}`.toUpperCase())
              : `${curr?.toUpperCase()}`)

          , '')
    );
  };


  public getAllEventsWithPagination(
    cursor: number,
    limit: number,
    categories: Record<EventCategory, EventCategory | undefined>,
    loggedInUserAccessToken: string
  ) {
    const params = { cursor, limit, categories: this._parseCategories(categories) };
    const AuthHeaders = this.configAuthHeader(loggedInUserAccessToken).headers;
    const config = { params, headers: AuthHeaders };

    return this.http.get<GetAllLatestEventsWithPagination>('/events', config);
  }


  // TODO make autorization configHeader
  public createOrDeleteLikeByEventID(eventID: number, loggedInUserAccessToken: string) {
    return (
      this.http
        .post<{ eventLikedOrDisliked: CreateEventLike }>
        (`/events/${eventID}/like`, null, this.configAuthHeader(loggedInUserAccessToken))
    );
  }


  public getLikedEventsByUserIdWithPagination(cursor: number, limit: number, loggedInUserToken: string, targerUserID?: number) {
    const params = { cursor, limit, userId: targerUserID };
    const AuthHeaders = this.configAuthHeader(loggedInUserToken).headers;
    const config = { params, headers: AuthHeaders };

    return this.http.get<GetLikedEventsForBucketListWithPagination>('/events/liked', config);
  }


  /**
   *
   * @param {string} userAccessToken  can be either the loggedInUser or the targetUser
   */
  public getEventByID(eventID: number, userAccessToken: string) {
    return this.http.get<GetEventByID>(`/events/liked/${eventID}`, this.configAuthHeader(userAccessToken));
  }


  public getAllUsersWhoLikedSameEventWithPagination(eventID: number, cursor: number, limit: number, accessToken: string) {
    const params = { cursor, limit };
    const AuthHeaders = this.configAuthHeader(accessToken).headers;
    const config = { params, headers: AuthHeaders };

    return this.http.get<GetMatchedUsersWhoLikedEventWithPagination>(`/events/liked/${eventID}/users`, config);
  }


  public getSameMatchedEventsByTwoUsersWithPagination(targetUserUuid: string, cursor: number, limit: number, loggedInUserAccessToken: string, allPhotos?: boolean,) {
    const params = { cursor, limit, allPhotos };
    const config = { params, headers: this.configAuthHeader(loggedInUserAccessToken).headers };

    return this.http.get<GetLikedEventsForBucketListWithPagination>(`/events/liked/matches/${targetUserUuid}`, config);
  }
}

export default new EventService();
