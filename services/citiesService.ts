import { AxiosInstance } from 'axios';
import { IGetPaginatedCities } from '../models/Cities';
import { RestApiService } from './restService';


class CitiesService {
  private http: AxiosInstance;

  constructor() {
    this.http = RestApiService.getInstance().http;
  }
  /**
   *
   * @param prefix {string}
   * @param offset {number} must be multiples of 10
   * @returns
   */
  searchCitiesByPrefix(prefix: string, cursor: number, limit = 10) {
    return this.http.get<IGetPaginatedCities>(`/world-cities?limit=${limit}&cursor=${cursor}&cityName=${prefix}`);
  }
}


export default new CitiesService();
