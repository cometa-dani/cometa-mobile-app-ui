export interface Cities {
  links: Link[];
  data: CityDatum[];
  metadata: Metadata;
}

export interface CityDatum {
  id: number;
  wikiDataId: string;
  type: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  regionWdId: string;
  latitude: number;
  longitude: number;
  population: number;
  distance: null | number;
  placeType: string;
}


interface Link {
  rel: string;
  href: string;
}

interface Metadata {
  currentOffset: number;
  totalCount: number;
}
