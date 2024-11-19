import axios, { AxiosInstance } from 'axios';
import { apiUrl } from '../constants/vars';


/**
 *
 * @description Singleton to handle all the API requests
 */
export class RestApiService {
  public http: AxiosInstance;
  private static _instance: RestApiService;

  private constructor() {
    this.http = axios.create({
      baseURL: apiUrl,
      timeout: 1_000 * 15, // 15 seconds
    });
  }

  public static getInstance(): RestApiService {
    if (!RestApiService._instance) {
      RestApiService._instance = new RestApiService();
    }
    return RestApiService._instance;
  }

  public setBearerToken(accessToken: string) {
    this.http.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  }
}
