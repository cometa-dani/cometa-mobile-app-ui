import { AxiosInstance } from 'axios';
import { RestApiService } from '../restService';
import { ICreateLocation, ILocation } from '@/models/Localization';


class LocationService {
  private http: AxiosInstance;

  constructor() {
    this.http = RestApiService.getInstance().http;
  }

  public getAll(organizationId: number) {
    return this.http.get<ILocation[]>(`/organizations/${organizationId}/locations`);
  }

  public create(organizationId: number, payload: ICreateLocation) {
    return this.http.post<ILocation>(`/organizations/${organizationId}/locations`, payload);
  }

  /**
   *
   * @param {string} id can be either the loggedInUser or the targetUser
   * @param {string} loggedInUserAccessToken
   * @returns
   */
  public getById(id: number) {
    return this.http.get<ILocation>(`/organizations/locations/${id}`);
  }
}


export const locationService = new LocationService();
