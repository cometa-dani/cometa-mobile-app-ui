export interface GetCitiesWithPagination {
  cities: CityDatum[];
  totalCities: number;
  nextCursor: number;
  citiesPerPage: number;
}

export interface CityDatum {
  id: number;
  city: string;
  country?: string;
}
