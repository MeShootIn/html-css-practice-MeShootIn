import request from '../helpers/request.js';
export const NA = 'N/A';
export default class OmdbApi {
    static API_URL = 'http://www.omdbapi.com/';
    static RESULT_TYPE = 'json';
    static API_VERSION = '1';
    apikey;
    timeout;
    /**
     * @param {string} apikey
     * @param {number} timeout
     */
    constructor(apikey, timeout = 3000) {
        this.apikey = apikey;
        this.timeout = timeout;
    }
    get requestUrl() {
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
    bySearch(title, page = 1) {
        const url = this.requestUrl;
        url.searchParams.set('s', title);
        url.searchParams.set('page', page.toString());
        return request(url.toString(), this.timeout);
    }
    /**
     * @param {string} imdbId
     */
    byId(imdbId) {
        const url = this.requestUrl;
        url.searchParams.set('i', imdbId);
        url.searchParams.set('plot', 'short');
        return request(url.toString(), this.timeout);
    }
}
