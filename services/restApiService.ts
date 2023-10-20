import axios, { AxiosRequestConfig } from 'axios';
import { apiUrl } from '../constants/vars';


export class RestApiService {
  protected http = axios.create({
    baseURL: apiUrl,
  });

  protected configAuthHeader(accessToken: string): AxiosRequestConfig<Headers> {
    return { headers: { Authorization: `Bearer ${accessToken}` } };
  }
}
