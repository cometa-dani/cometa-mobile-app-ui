import { GetCitiesWithPagination } from '../models/Cities';
import { RestApiService } from './restService';


class CitiesService extends RestApiService {
  /**
   *
   * @param prefix {string}
   * @param offset {number} must be multiples of 10
   * @returns
   */
  searchCitiesByPrefix(prefix: string, cursor: number, limit = 10) {
    return this.http.get<GetCitiesWithPagination>(`/world-cities?limit=${limit}&cursor=${cursor}&cityName=${prefix}`);
  }
}


export default new CitiesService();
