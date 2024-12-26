import { IGetLatestPaginatedEvents, CreateEventLike, EventCategory } from '../models/Event';
import { GetEventByID } from '../models/EventLike';
import { IGetPaginatedLikedEventsBucketList } from '../models/LikedEvent';
import { IGetPaginatedUsersWhoLikedSameEvent } from '../models/User';
import { RestApiService } from './restService';


interface ISearchParams {
  cursor: number,
  limit: number,
  categories: Record<EventCategory, EventCategory | undefined>,
  name?: string
}

class EventService {
  private http = RestApiService.getInstance().http;

  /**
   *
   * @description Parse the categories object to a string
   */
  private _parseCategories = (params: object): string => {
    const initialValue = '';
    return (
      Object
        .values(params)
        .filter(val => val)
        .reduce(
          (prev, curr) => (
            prev ? prev?.concat(`,${curr}`.toUpperCase())
              : `${curr?.toUpperCase()}`)
          ,
          initialValue
        ).trim()
    );
  };


  public searchEventsWithPagination({ categories, cursor, limit, name }: ISearchParams) {
    const categoriesPayload = this._parseCategories(categories);
    const params: { cursor: number, limit: number, name?: string, categories?: string } = (
      { cursor, limit, name, categories: categoriesPayload }
    );
    if (!params.categories) {
      delete params.categories;
    }
    if (!params.name) {
      delete params.name;
    }
    return this.http.get<IGetLatestPaginatedEvents>('/events', { params });
  }


  // TODO make autorization configHeader
  public createOrDeleteLikeByEventID(eventID: number) {
    return (
      this.http
        .post<{ eventLikedOrDisliked: CreateEventLike }>
        (`/events/${eventID}/likes`, null)
    );
  }


  public getLikedEventsByUserIdWithPagination(cursor: number, limit: number, targerUserID?: number) {
    const params = { cursor, limit, userId: targerUserID };
    return this.http.get<IGetPaginatedLikedEventsBucketList>('/events/liked', { params });
  }


  /**
   *
   * @param {string} userAccessToken  can be either the loggedInUser or the targetUser
   */
  public getEventByID(eventID: number) {
    return this.http.get<GetEventByID>(`/events/liked/${eventID}`);
  }


  public getAllUsersWhoLikedSameEventWithPagination(eventID: number, cursor: number, limit: number) {
    const params = { cursor, limit };
    const config = { params };
    return this.http.get<IGetPaginatedUsersWhoLikedSameEvent>(`/events/liked/${eventID}/users`, config);
  }


  public getSameMatchedEventsByTwoUsersWithPagination(targetUserUuid: string, cursor: number, limit: number, allPhotos?: boolean,) {
    const params = { cursor, limit, allPhotos };
    const config = { params };
    return this.http.get<IGetLatestPaginatedEvents>(`/events/liked/matches/${targetUserUuid}`, config);
  }
}

export default new EventService();
