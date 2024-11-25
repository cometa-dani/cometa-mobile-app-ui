import { IPaginated } from './utils/Paginated';


export interface IGetPaginatedCities extends IPaginated<ICityDatum> { }

export interface ICityDatum {
  id: number;
  city: string;
  country?: string;
}
