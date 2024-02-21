export interface GetCitiesWithPagination {
  cities: CityDatum[];
  totalCities: number;
  nextCursor: number;
  citiesPerPage: number;
}

export interface CityDatum {
  id: number;
  population?: number;
  capital?: string;
  city: string;
  cityAscii: string;
  adminName?: string;
  iso2?: string;
  iso3?: string;
  country?: string;
  lng: number;
  lat: number;
}
