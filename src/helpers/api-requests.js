import limitedRateCalls from './limited-rate-calls.js';
const FILMS_PER_PAGE = 10;
export async function bySearchAll(api, title, maxCalls = 1) {
    const firstPagePromise = api.bySearch(title, 1);
    const firstPage = await firstPagePromise;
    const PAGES = Math.ceil(+firstPage.totalResults / FILMS_PER_PAGE);
    const wrapFns = [];
    for (let p = 2; p <= PAGES; ++p) {
        wrapFns[p - 2] = () => api.bySearch(title, p);
    }
    return {
        pages: PAGES,
        BySearchPromises: [
            firstPagePromise, ...limitedRateCalls(wrapFns, maxCalls)
        ]
    };
}
export async function byIdAll(api, ids, maxCalls = 1) {
    const wrapFns = ids.map(id => () => api.byId(id));
    return limitedRateCalls(wrapFns, maxCalls);
}
