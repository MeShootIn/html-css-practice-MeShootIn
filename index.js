"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Ключи OMDb:
 * 7ea4aa35
 * da979bab
 */
var omdb_api_js_1 = require("./src/apis/omdb-api.js");
var api_requests_js_1 = require("./src/helpers/api-requests.js");
var film_card_js_1 = require("./src/components/film-card.js");
var q_selector_js_1 = require("./src/helpers/q-selector.js");
var search_tag_container_js_1 = require("./src/components/search-tag-container.js");
// // DEBUG
// const searchTagTitles: string[] = [
//   'No Way Home',
//   'no country for old men',
//   'Star Trek II',
//   'sTAr wArS iI',
//   'Kung Fury',
//   'Back to the Future',
// ];
// localStorage.clear();
// console.log('localStorage has been cleared');
// localStorage.setItem('search-tags', JSON.stringify(searchTagTitles));
var API_KEY = 'da979bab';
var api = new omdb_api_js_1.default(API_KEY);
var $searchTagContainer = new search_tag_container_js_1.default();
(0, q_selector_js_1.default)('.search-form__tags')
    .appendChild($searchTagContainer);
(0, q_selector_js_1.default)('.search-form')
    .addEventListener('submit', function (event) {
    event.preventDefault();
    var $input = (0, q_selector_js_1.default)('.search-form__input');
    $input.value = $input.value.replace(/ +/g, ' ').trim();
    var inputValue = $input.value;
    (0, search_tag_container_js_1.addSearchTag)($searchTagContainer, inputValue);
    runSearch(inputValue.toLowerCase());
});
function runSearch(title) {
    return __awaiter(this, void 0, void 0, function () {
        function checkResponse(apiResponse) {
            if (apiResponse.Response === 'False') {
                throw new Error(apiResponse.Error);
            }
        }
        var $resultsResume, $resultContainer_1, result, firstResponse, totalResults, _i, _a, promise, _1;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    $resultsResume = (0, q_selector_js_1.default)('.results__resume');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    $resultContainer_1 = (0, q_selector_js_1.default)('.result-container');
                    $resultContainer_1.innerHTML = '';
                    return [4 /*yield*/, (0, api_requests_js_1.bySearchAll)(api, title, window.navigator.hardwareConcurrency)];
                case 2:
                    result = _b.sent();
                    return [4 /*yield*/, result.BySearchPromises[0]];
                case 3:
                    firstResponse = _b.sent();
                    checkResponse(firstResponse);
                    totalResults = +firstResponse.totalResults;
                    $resultsResume.textContent = "\u041D\u0430\u0448\u043B\u0438 ".concat(totalResults, " \u0444\u0438\u043B\u044C\u043C\u043E\u0432(-\u043C\u0430)");
                    for (_i = 0, _a = result.BySearchPromises; _i < _a.length; _i++) {
                        promise = _a[_i];
                        promise.then(function (bySearchResponse) {
                            checkResponse(bySearchResponse);
                            bySearchResponse.Search.forEach(function (shortInfo) { return __awaiter(_this, void 0, void 0, function () {
                                var byIdResponse, id, item;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            id = shortInfo.imdbID;
                                            item = localStorage.getItem(id);
                                            if (!(item === null)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, api.byId(id)];
                                        case 1:
                                            byIdResponse = _a.sent();
                                            localStorage.setItem(id, JSON.stringify(byIdResponse));
                                            return [3 /*break*/, 3];
                                        case 2:
                                            byIdResponse = JSON.parse(item);
                                            _a.label = 3;
                                        case 3:
                                            checkResponse(byIdResponse);
                                            $resultContainer_1.appendChild(new film_card_js_1.default(byIdResponse.Title, byIdResponse.Year, byIdResponse.Poster, byIdResponse.Ratings, byIdResponse.Genre, "https://www.imdb.com/title/".concat(shortInfo.imdbID, "/")));
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        });
                    }
                    return [3 /*break*/, 5];
                case 4:
                    _1 = _b.sent();
                    $resultsResume.textContent = 'Что-то пошло не так ¯\\_(ツ)_/¯';
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
