export interface RadioStation {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  favicon: string;
  votes: number;
  codec: string;
  bitrate: number;
}

export interface CountryProperties {
  ADMIN: string;
  ISO_A2: string;
  POP_EST: number;
}

export interface GeoFeature {
  type: string;
  properties: CountryProperties;
  geometry: any;
}

export interface AIInsightData {
  country: string;
  summary: string;
  musicCulture: string;
  popularGenres: string[];
}
