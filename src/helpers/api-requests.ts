import OmdbApi, {ByIdResponse, BySearchResponse} from '../api/omdb-api.js';
import limitedRateCalls, {WrapFn} from './limited-rate-calls.js';


const FILMS_PER_PAGE = 10;

export interface BySearchAllResponse {
  pages: number,
  BySearchPromises: Promise<BySearchResponse>[]
}

export async function bySearchAll(
  api: OmdbApi, title: string, maxCalls: number = 1
): Promise<BySearchAllResponse> {
  const firstPagePromise = api.bySearch(title, 1);
  const firstPage = await firstPagePromise;
  const PAGES = Math.ceil(
    +firstPage.totalResults / FILMS_PER_PAGE
  );
  const wrapFns: WrapFn<BySearchResponse>[] = [];

  for (let p = 2; p <= PAGES; ++p) {
    wrapFns[p - 2] = () => api.bySearch(title, p);
  }

  return {
    pages: PAGES,
    BySearchPromises: [
      firstPagePromise, ...limitedRateCalls<BySearchResponse>(wrapFns, maxCalls)
    ]
  };
}

export async function byIdAll(
  api: OmdbApi, ids: string[], maxCalls: number = 1
): Promise<Promise<ByIdResponse>[]> {
  const wrapFns: WrapFn<ByIdResponse>[] = ids.map(id => () => api.byId(id));

  return limitedRateCalls<ByIdResponse>(wrapFns, maxCalls);
}