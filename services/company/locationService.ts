import { AxiosInstance } from 'axios';
import { RestApiService } from '../restService';
import { ILocation } from '@/models/Localization';


class LocationService {
  private http: AxiosInstance;

  constructor() {
    this.http = RestApiService.getInstance().http;
  }

  public create(payload: ILocation) {
    return this.http.post<ILocation>('/organizations/events/locations', payload);
  }

  /**
   *
   * @param {string} id can be either the loggedInUser or the targetUser
   * @param {string} loggedInUserAccessToken
   * @returns
   */
  public getById(id: number) {
    return this.http.get<ILocation>(`/organizations/events/locations/${id}`);
  }

  public getAll() {
    return this.http.get<ILocation[]>('/organizations/events/locations');
  }
}


export const locationService = new LocationService();
