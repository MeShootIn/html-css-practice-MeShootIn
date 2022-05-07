import request from '../helpers/request.js';


export const NA = 'N/A';

export interface ApiResponse {
  Response: 'True' | 'False',
  Error?: string,
}

export interface Rating {
  Source: 'Internet Movie Database' | 'Rotten Tomatoes' | 'Metacritic',
  Value: string,
}

export interface ShortFilmInfo {
  Poster: string,
  Title: string,
  Year: string,
  imdbID: string,
}

export interface FilmInfo extends ShortFilmInfo {
  Genre: string,
  Ratings: Rating[],
  Website: string,
}

export interface BySearchResponse extends ApiResponse {
  Search: ShortFilmInfo[],
  totalResults: string,
}

export interface ByIdResponse extends ApiResponse, FilmInfo {
}

export default class OmdbApi {
  private static readonly API_URL = 'http://www.omdbapi.com/';
  private static readonly RESULT_TYPE = 'json';
  private static readonly API_VERSION = '1';

  private readonly apikey: string;
  private readonly timeout: number;

  /**
   * @param {string} apikey
   * @param {number} timeout
   */
  constructor(apikey: string, timeout: number = 3000) {
    this.apikey = apikey;
    this.timeout = timeout;
  }

  private get requestUrl(): URL {
    const url = new URL(OmdbApi.API_URL);
    url.searchParams.set('apikey', this.apikey);
    url.searchParams.set('r', OmdbApi.RESULT_TYPE);
    url.searchParams.set('v', OmdbApi.API_VERSION);

    return url;
  }

  /**
   * @param {string} title
   * @param {number} page
   */
  bySearch(title: string, page: number = 1): Promise<BySearchResponse> {
    const url = this.requestUrl;
    url.searchParams.set('s', title);
    url.searchParams.set('page', page.toString());

    return request(url.toString(), this.timeout);
  }

  /**
   * @param {string} imdbId
   */
  byId(imdbId: string): Promise<ByIdResponse> {
    const url = this.requestUrl;
    url.searchParams.set('i', imdbId);
    url.searchParams.set('plot', 'short');

    return request(url.toString(), this.timeout);
  }
}