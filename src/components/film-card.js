"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
          ({__proto__: []} instanceof Array && function (d, b) {
              d.__proto__ = b;
          }) ||
          function (d, b) {
              for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
          };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);

        function __() {
            this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", {value: true});
exports.DefaultValues = exports.Params = void 0;
var q_selector_js_1 = require("../helpers/q-selector.js");
var enum_params_js_1 = require("../helpers/enum-params.js");
var omdb_api_js_1 = require("../apis/omdb-api.js");
var style_links_js_1 = require("../helpers/style-links.js");

function getRatingEmoji(rating) {
    var numeric;
    switch (rating.Source) {
        case "Rotten Tomatoes":
            numeric = +rating.Value.slice(0, -1) / 100;
            break;
        default:
            var parts = rating.Value.split('/');
            numeric = +parts[0] / +parts[1];
            break;
    }
    if (numeric < 0.2) {
        return 'rating-emoji_poor';
    }
    if (numeric < 0.4) {
        return 'rating-emoji_fair';
    }
    if (numeric < 0.6) {
        return 'rating-emoji_good';
    }
    if (numeric < 0.8) {
        return 'rating-emoji_very-good';
    }
    return 'rating-emoji_excellent';
}

var $filmCardTemplate = document.createElement('template');
$filmCardTemplate.innerHTML = "\n".concat(style_links_js_1.default, "\n\n<style>\n/* \u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u0441 \u0444\u0438\u043B\u044C\u043C\u043E\u043C (\u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E \u0432 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438) */\n.film {\n  position: relative;\n  border-radius: 12px;\n  width: 302px;\n  height: 454px;\n  cursor: pointer;\n  background: rgba(255, 255, 255, 0.24);\n\n  color: rgba(255, 255, 255, 0.24);\n}\n\n.film-link:hover, .film-link:visited, .film-link:link, .film-link:active {\n  text-decoration: none;\n}\n\n/* \u041F\u043E\u0441\u0442\u0435\u0440 \u0444\u0438\u043B\u044C\u043C\u0430 */\n.film-poster {\n  width: 100%;\n  height: 100%;\n}\n\n.film-poster__image {\n  border-radius: 12px;\n  width: 100%;\n  height: 100%;\n}\n\n/* \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 */\n.film-description {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n  align-items: flex-start;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border-radius: 12px;\n}\n\n/* \u0417\u0430\u0433\u043B\u0443\u0448\u043A\u0438 */\n.film-description__stubs {\n  padding: 0 36px 68px 20px;\n}\n\n.film-description-stub {\n  display: block;\n  height: 24px;\n  border-radius: 2px;\n  background: rgba(255, 255, 255, 0.08);\n}\n\n.film-description-stub__first-line {\n  width: 100%;\n}\n\n.film-description-stub__second-line {\n  /* \u0428\u0438\u0440\u0438\u043D\u044B 1-\u043E\u0439 \u0438 2-\u043E\u0439 \u0441\u0442\u0440\u043E\u043A \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0442\u0435\u043A\u0441\u0442\u0430 */\n  --first-line-lw: 246;\n  --second-line-lw: 156;\n\n  width: calc((var(--second-line-lw) / var(--first-line-lw)) * 100%);\n  margin-top: 8px;\n}\n\n.displayer {\n  display: none;\n}\n\n/* \u0420\u0435\u0430\u043B\u044C\u043D\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 */\n.film-description__full {\n  padding: 0 20px 20px;\n}\n\n.film_with-description .film-description__stubs {\n  display: none;\n}\n\n.film_with-description .displayer {\n  display: inline;\n}\n\n.film:hover .film-description__full {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n  align-items: flex-start;\n\n  background: linear-gradient(\n    180deg, rgba(0, 0, 0, 0) 26.43%, rgba(0, 0, 0, 0.8) 72.41%\n  );\n  backdrop-filter: blur(2px);\n}\n\n/* \u0420\u0435\u0439\u0442\u0438\u043D\u0433 */\n.film-description__rating {\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n}\n\n/* \u0420\u0435\u0439\u0442\u0438\u043D\u0433\u043E\u0432\u044B\u0435 \u044D\u043C\u043E\u0434\u0437\u0438 */\n.rating-emoji {\n  width: 24px;\n  height: 24px;\n}\n\n.rating-emoji_poor {\n  background: url('../../images/rating/0-1.svg') no-repeat center center;\n  background-size: cover;\n}\n\n.rating-emoji_fair {\n  background: url('../../images/rating/1-2.svg') no-repeat center center;\n  background-size: cover;\n}\n\n.rating-emoji_good {\n  background: url('../../images/rating/2-3.svg') no-repeat center center;\n  background-size: cover;\n}\n\n.rating-emoji_very-good {\n  background: url('../../images/rating/3-4.svg') no-repeat center center;\n  background-size: cover;\n}\n\n.rating-emoji_excellent {\n  background: url('../../images/rating/4-5.svg') no-repeat center center;\n  background-size: cover;\n}\n\n/* \u0427\u0438\u0441\u043B\u0435\u043D\u043D\u044B\u0439 \u0440\u0435\u0439\u0442\u0438\u043D\u0433 */\n.film-description__rating-points {\n  font-weight: 400;\n  font-size: 24px;\n  line-height: 36px;\n\n  display: flex;\n  align-items: center;\n}\n\n.film-description__rating-points::before {\n  content: '\\00a0';\n}\n\n/* \u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 */\n.film-description__title {\n  margin-top: 4px;\n}\n\n.film-description__title-text {\n  font-weight: 700;\n  font-size: 24px;\n  line-height: 36px;\n\n  display: flex;\n  align-items: center;\n}\n\n.film_with-poster .film-description__rating-points, \n .film-description__title-text {\n  color: rgba(255, 255, 255, 1);\n}\n\n/* \u0416\u0430\u043D\u0440 \u0438 \u0433\u043E\u0434 */\n.film-description__genre-year {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  width: 100%;\n  margin-top: 16px;\n\n  font-weight: 400;\n  font-size: 16px;\n  line-height: 24px;\n  color: rgba(255, 255, 255, 0.4);\n}\n\n.film-description__genre {\n  display: flex;\n  align-items: center;\n}\n\n.film-description__year {\n  display: flex;\n  align-items: center;\n\n  text-align: right;\n}\n</style>\n\n<article class=\"film\">\n  <a class=\"film-link\" href=\"##\">\n    <div class=\"film-poster\">\n      <img class=\"film-poster__image\" src=\"\" alt=\"\">\n    </div>\n    \n    <div class=\"film-description film-description__stubs\">\n      <div class=\"film-description-stub film-description-stub__first-line\"></div>\n      <div class=\"film-description-stub film-description-stub__second-line\"></div>\n    </div>\n    \n    <span class=\"displayer\">\n      <div class=\"film-description film-description__full\">\n        <div class=\"film-description__rating\">\n          <div class=\"rating-emoji\"></div>\n          <p class=\"film-description__rating-points\"></p>\n        </div>\n        <div class=\"film-description__title\">\n          <p class=\"film-description__title-text\"></p>\n        </div>\n        <div class=\"film-description__genre-year\">\n          <p class=\"film-description__genre\"></p>\n          <p class=\"film-description__year\"></p>\n        </div>\n      </div>\n    </span>\n  </a>\n</article>\n");
var Params;
(function (Params) {
    Params["Title"] = "Title";
    Params["Year"] = "Year";
    Params["Poster"] = "Poster";
    Params["Rating"] = "Rating";
    Params["Genre"] = "Genre";
    Params["Website"] = "Website";
})(Params = exports.Params || (exports.Params = {}));
var DefaultValues;
(function (DefaultValues) {
    DefaultValues["Title"] = "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435...";
    DefaultValues["Year"] = "\u0413\u043E\u0434...";
    DefaultValues["Poster"] = "images/film_loader.gif";
    DefaultValues["Rating"] = "\u0420\u0435\u0439\u0442\u0438\u043D\u0433...";
    DefaultValues["Genre"] = "\u0416\u0430\u043D\u0440...";
    DefaultValues["Website"] = "##";
})(DefaultValues = exports.DefaultValues || (exports.DefaultValues = {}));
var checkNA = function (value) {
    return (value !== omdb_api_js_1.NA) ? value : undefined;
};
var FilmCard = /** @class */ (function (_super) {
    __extends(FilmCard, _super);

    function FilmCard(title, year, poster, ratings, genre, website) {
        var _this = _super.call(this) || this;
        _this.Title = title;
        _this.Year = year;
        _this.Poster = poster;
        _this.Ratings = ratings !== null && ratings !== void 0 ? ratings : [];
        _this.Genre = genre;
        _this.Website = website;
        var shadow = _this.attachShadow({
            mode: 'open'
        });
        var $template = $filmCardTemplate.content.cloneNode(true);
        shadow.appendChild($template);
        _this.sr = _this.shadowRoot;
        return _this;
    }

    Object.defineProperty(FilmCard, "observedAttributes", {
        get: function () {
            return (0, enum_params_js_1.default)(Params);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FilmCard.prototype, "Title", {
        get: function () {
            var _a;
            return (_a = this.getAttribute(Params.Title)) !== null && _a !== void 0 ? _a : DefaultValues.Title;
        },
        set: function (value) {
            var _a;
            this.setAttribute(Params.Title, (_a = checkNA(value)) !== null && _a !== void 0 ? _a : this.Title);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FilmCard.prototype, "Year", {
        get: function () {
            var _a;
            return (_a = this.getAttribute(Params.Year)) !== null && _a !== void 0 ? _a : DefaultValues.Year;
        },
        set: function (value) {
            var _a;
            this.setAttribute(Params.Year, (_a = checkNA(value)) !== null && _a !== void 0 ? _a : this.Year);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FilmCard.prototype, "Poster", {
        get: function () {
            var _a;
            return (_a = this.getAttribute(Params.Poster)) !== null && _a !== void 0 ? _a : DefaultValues.Poster;
        },
        set: function (value) {
            var _a;
            this.setAttribute(Params.Poster, (_a = checkNA(value)) !== null && _a !== void 0 ? _a : this.Poster);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FilmCard.prototype, "Rating", {
        get: function () {
            var _a;
            return (_a = this.getAttribute(Params.Rating)) !== null && _a !== void 0 ? _a : DefaultValues.Rating;
        },
        set: function (value) {
            var _a;
            this.setAttribute(Params.Rating, (_a = checkNA(value)) !== null && _a !== void 0 ? _a : this.Rating);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FilmCard.prototype, "Genre", {
        get: function () {
            var _a;
            return (_a = this.getAttribute(Params.Genre)) !== null && _a !== void 0 ? _a : DefaultValues.Genre;
        },
        set: function (value) {
            var _a;
            this.setAttribute(Params.Genre, (_a = checkNA(value)) !== null && _a !== void 0 ? _a : this.Genre);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FilmCard.prototype, "Website", {
        get: function () {
            var _a;
            return (_a = this.getAttribute(Params.Website)) !== null && _a !== void 0 ? _a : DefaultValues.Website;
        },
        set: function (value) {
            var _a;
            this.setAttribute(Params.Website, (_a = checkNA(value)) !== null && _a !== void 0 ? _a : this.Website);
        },
        enumerable: false,
        configurable: true
    });
    FilmCard.prototype.connectedCallback = function () {
        var _a, _b, _c;
        var $film = (0, q_selector_js_1.default)('.film', this.sr);
        if ((_c = (_b = (_a = this.Title !== DefaultValues.Title) !== null && _a !== void 0 ? _a : this.Year !== DefaultValues.Year) !== null && _b !== void 0 ? _b : this.Rating !== DefaultValues.Rating) !== null && _c !== void 0 ? _c : this.Genre !== DefaultValues.Genre) {
            $film.classList.add('film_with-description');
        }
        // Сайт
        var $filmLink = (0, q_selector_js_1.default)('.film-link', $film);
        $filmLink.href = this.Website;
        // Постер
        var $posterImage = (0, q_selector_js_1.default)('.film-poster .film-poster__image', $film);
        $posterImage.alt = this.Title;
        $posterImage.src = DefaultValues.Poster;
        if (this.Poster !== DefaultValues.Poster) {
            $film.classList.add('film_with-poster');
        }
        var $poster = document.createElement('img');
        $poster.src = this.Poster;
        $poster.addEventListener('load', function () {
            $posterImage.src = $poster.src;
        });
        // Реальное описание
        var $description = (0, q_selector_js_1.default)('.film-description__full', $film);
        // Рейтинг
        var $rating = (0, q_selector_js_1.default)('.film-description__rating', $description);
        var $ratingEmoji = (0, q_selector_js_1.default)('.rating-emoji', $rating);
        $ratingEmoji.textContent = '🤔';
        var $ratingPoints = (0, q_selector_js_1.default)('.film-description__rating-points', $rating);
        $ratingPoints.textContent = this.Rating;
        if (this.Ratings.length > 0) {
            $ratingEmoji.classList.add(getRatingEmoji(this.Ratings[0]));
            $ratingEmoji.textContent = '';
            $ratingPoints.textContent = this.Ratings[0].Value;
        }
        // Название
        var $title = (0, q_selector_js_1.default)('.film-description__title-text', $description);
        $title.textContent = this.Title;
        // Жанр и год
        var $genreYear = (0, q_selector_js_1.default)('.film-description__genre-year', $description);
        var $genre = (0, q_selector_js_1.default)('.film-description__genre', $genreYear);
        $genre.textContent = this.Genre;
        var $year = (0, q_selector_js_1.default)('.film-description__year', $genreYear);
        $year.textContent = this.Year;
    };
    return FilmCard;
}(HTMLElement));
exports.default = FilmCard;
customElements.define('film-card', FilmCard);
