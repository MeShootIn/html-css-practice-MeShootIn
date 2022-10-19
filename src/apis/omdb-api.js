"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.NA = void 0;
var request_js_1 = require("../helpers/request.js");
exports.NA = 'N/A';
var OmdbApi = /** @class */ (function () {
  /**
   * @param {string} apikey
   * @param {number} timeout
   */
  function OmdbApi(apikey, timeout) {
    if (timeout === void 0) {
      timeout = 3000;
    }
    this.apikey = apikey;
    this.timeout = timeout;
  }

  Object.defineProperty(OmdbApi.prototype, "requestUrl", {
    get: function () {
      var url = new URL(OmdbApi.API_URL);
      url.searchParams.set('apikey', this.apikey);
      url.searchParams.set('r', OmdbApi.RESULT_TYPE);
      url.searchParams.set('v', OmdbApi.API_VERSION);
      return url;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * @param {string} title
   * @param {number} page
   */
  OmdbApi.prototype.bySearch = function (title, page) {
    if (page === void 0) {
      page = 1;
    }
    var url = this.requestUrl;
    url.searchParams.set('s', title);
    url.searchParams.set('page', page.toString());
    return (0, request_js_1.default)(url.toString(), this.timeout);
  };
  /**
   * @param {string} imdbId
   */
  OmdbApi.prototype.byId = function (imdbId) {
    var url = this.requestUrl;
    url.searchParams.set('i', imdbId);
    url.searchParams.set('plot', 'short');
    return (0, request_js_1.default)(url.toString(), this.timeout);
  };
  OmdbApi.API_URL = 'http://www.omdbapi.com/';
  OmdbApi.RESULT_TYPE = 'json';
  OmdbApi.API_VERSION = '1';
  return OmdbApi;
}());
exports.default = OmdbApi;
