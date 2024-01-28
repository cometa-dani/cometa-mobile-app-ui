import axios from 'axios';
import { Cities } from '../models/Cities';


class CitiesService {

  private http = axios.create({
    baseURL: 'http://geodb-free-service.wirefreethought.com/v1/geo/'
  });

  /**
   *
   * @param prefix {string}
   * @param offset {number} must be multiples of 10
   * @returns
   */
  searchCitiesByPrefix(offset: number, prefix: string) {
    return this.http.get<Cities>(`/places?limit=10&offset=${offset}&namePrefix=${prefix}`);
  }
}


export default new CitiesService();
