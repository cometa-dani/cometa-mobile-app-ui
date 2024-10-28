export interface GetCitiesWithPagination {
  items: CityDatum[];
  totalItems: number;
  nextCursor: number;
  itemsPerPage: number;
  hasNextCursor: boolean;
}

export interface CityDatum {
  id: number;
  city: string;
  country?: string;
}
