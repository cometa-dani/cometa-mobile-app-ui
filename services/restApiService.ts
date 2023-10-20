import axios, { AxiosRequestConfig } from 'axios';
import { apiUrl } from '../constants/vars';


export class RestApiService {
  protected http = axios.create({
    baseURL: apiUrl,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    }
  });

  protected configAuthHeader(accessToken: string): AxiosRequestConfig<Headers> {
    return { headers: { Authorization: `Bearer ${accessToken}` } };
  }
}
