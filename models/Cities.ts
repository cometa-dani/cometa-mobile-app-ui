import { IPaginated } from './utils/Paginated';


export interface IGetPaginatedCities extends IPaginated<CityDatum> { }

export interface CityDatum {
  id: number;
  city: string;
  country?: string;
}
