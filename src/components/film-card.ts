import qSelector from '../helpers/q-selector.js';
import enumParams from '../helpers/enum-params.js';
import {NA, Rating} from "../apis/omdb-api.js";
import styleLinks from "../helpers/style-links.js";


function getRatingEmoji(rating: Rating): string {
  let numeric: number;

  switch (rating.Source) {
    case "Rotten Tomatoes":
      numeric = +rating.Value.slice(0, -1) / 100;

      break;
    default:
      const parts = rating.Value.split('/');
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

const $filmCardTemplate = document.createElement('template');
$filmCardTemplate.innerHTML = `
${styleLinks}

<style>
/* Карточка с фильмом (по умолчанию в состоянии загрузки) */
.film {
  position: relative;
  border-radius: 12px;
  width: 302px;
  height: 454px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.24);

  color: rgba(255, 255, 255, 0.24);
}

.film-link:hover, .film-link:visited, .film-link:link, .film-link:active {
  text-decoration: none;
}

/* Постер фильма */
.film-poster {
  width: 100%;
  height: 100%;
}

.film-poster__image {
  border-radius: 12px;
  width: 100%;
  height: 100%;
}

/* Описание */
.film-description {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

/* Заглушки */
.film-description__stubs {
  padding: 0 36px 68px 20px;
}

.film-description-stub {
  display: block;
  height: 24px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08);
}

.film-description-stub__first-line {
  width: 100%;
}

.film-description-stub__second-line {
  /* Ширины 1-ой и 2-ой строк при загрузке текста */
  --first-line-lw: 246;
  --second-line-lw: 156;

  width: calc((var(--second-line-lw) / var(--first-line-lw)) * 100%);
  margin-top: 8px;
}

.displayer {
  display: none;
}

/* Реальное описание */
.film-description__full {
  padding: 0 20px 20px;
}

.film_with-description .film-description__stubs {
  display: none;
}

.film_with-description .displayer {
  display: inline;
}

.film:hover .film-description__full {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;

  background: linear-gradient(
    180deg, rgba(0, 0, 0, 0) 26.43%, rgba(0, 0, 0, 0.8) 72.41%
  );
  backdrop-filter: blur(2px);
}

/* Рейтинг */
.film-description__rating {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

/* Рейтинговые эмодзи */
.rating-emoji {
  width: 24px;
  height: 24px;
}

.rating-emoji_poor {
  background: url('../../images/rating/0-1.svg') no-repeat center center;
  background-size: cover;
}

.rating-emoji_fair {
  background: url('../../images/rating/1-2.svg') no-repeat center center;
  background-size: cover;
}

.rating-emoji_good {
  background: url('../../images/rating/2-3.svg') no-repeat center center;
  background-size: cover;
}

.rating-emoji_very-good {
  background: url('../../images/rating/3-4.svg') no-repeat center center;
  background-size: cover;
}

.rating-emoji_excellent {
  background: url('../../images/rating/4-5.svg') no-repeat center center;
  background-size: cover;
}

/* Численный рейтинг */
.film-description__rating-points {
  font-weight: 400;
  font-size: 24px;
  line-height: 36px;

  display: flex;
  align-items: center;
}

.film-description__rating-points::before {
  content: '\\00a0';
}

/* Название */
.film-description__title {
  margin-top: 4px;
}

.film-description__title-text {
  font-weight: 700;
  font-size: 24px;
  line-height: 36px;

  display: flex;
  align-items: center;
}

.film_with-poster .film-description__rating-points, 
 .film-description__title-text {
  color: rgba(255, 255, 255, 1);
}

/* Жанр и год */
.film-description__genre-year {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 16px;

  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.4);
}

.film-description__genre {
  display: flex;
  align-items: center;
}

.film-description__year {
  display: flex;
  align-items: center;

  text-align: right;
}
</style>

<article class="film">
  <a class="film-link" href="##">
    <div class="film-poster">
      <img class="film-poster__image" src="" alt="">
    </div>
    
    <div class="film-description film-description__stubs">
      <div class="film-description-stub film-description-stub__first-line"></div>
      <div class="film-description-stub film-description-stub__second-line"></div>
    </div>
    
    <span class="displayer">
      <div class="film-description film-description__full">
        <div class="film-description__rating">
          <div class="rating-emoji"></div>
          <p class="film-description__rating-points"></p>
        </div>
        <div class="film-description__title">
          <p class="film-description__title-text"></p>
        </div>
        <div class="film-description__genre-year">
          <p class="film-description__genre"></p>
          <p class="film-description__year"></p>
        </div>
      </div>
    </span>
  </a>
</article>
`;

export enum Params {
  Title = 'Title',
  Year = 'Year',
  Poster = 'Poster',
  Rating = 'Rating',
  Genre = 'Genre',
  Website = 'Website',
}

export enum DefaultValues {
  Title = 'Название...',
  Year = 'Год...',
  Poster = 'images/film_loader.gif',
  Rating = 'Рейтинг...',
  Genre = 'Жанр...',
  Website = '##'
}

const checkNA = (value: string | undefined): string | undefined =>
  (value !== NA) ? value : undefined;

export default class FilmCard extends HTMLElement {
  readonly Ratings: Rating[];
  private readonly sr: ShadowRoot;

  constructor(
    title?: string,
    year?: string,
    poster?: string,
    ratings?: Rating[],
    genre?: string,
    website?: string,
  ) {
    super();

    this.Title = title;
    this.Year = year;
    this.Poster = poster;
    this.Ratings = ratings ?? [];
    this.Genre = genre;
    this.Website = website;

    const shadow = this.attachShadow({
      mode: 'open'
    });
    const $template = $filmCardTemplate.content.cloneNode(true);
    shadow.appendChild($template);

    this.sr = this.shadowRoot as ShadowRoot;
  }

  static get observedAttributes(): string[] {
    return enumParams(Params);
  }

  get Title(): string {
    return this.getAttribute(Params.Title) ?? DefaultValues.Title;
  }

  set Title(value: string | undefined) {
    this.setAttribute(Params.Title, checkNA(value) ?? this.Title);
  }

  get Year(): string {
    return this.getAttribute(Params.Year) ?? DefaultValues.Year;
  }

  set Year(value: string | undefined) {
    this.setAttribute(Params.Year, checkNA(value) ?? this.Year);
  }

  get Poster(): string {
    return this.getAttribute(Params.Poster) ?? DefaultValues.Poster;
  }

  set Poster(value: string | undefined) {
    this.setAttribute(Params.Poster, checkNA(value) ?? this.Poster);
  }

  get Rating(): string {
    return this.getAttribute(Params.Rating) ?? DefaultValues.Rating;
  }

  set Rating(value: string | undefined) {
    this.setAttribute(Params.Rating, checkNA(value) ?? this.Rating);
  }

  get Genre(): string {
    return this.getAttribute(Params.Genre) ?? DefaultValues.Genre;
  }

  set Genre(value: string | undefined) {
    this.setAttribute(Params.Genre, checkNA(value) ?? this.Genre);
  }

  get Website(): string {
    return this.getAttribute(Params.Website) ?? DefaultValues.Website;
  }

  set Website(value: string | undefined) {
    this.setAttribute(Params.Website, checkNA(value) ?? this.Website);
  }

  connectedCallback() {
    const $film = qSelector<HTMLElement>('.film', this.sr);

    if (
      this.Title !== DefaultValues.Title ??
      this.Year !== DefaultValues.Year ??
      this.Rating !== DefaultValues.Rating ??
      this.Genre !== DefaultValues.Genre
    ) {
      $film.classList.add('film_with-description');
    }

    // Сайт
    const $filmLink = qSelector<HTMLAnchorElement>('.film-link', $film);
    $filmLink.href = this.Website;

    // Постер
    const $posterImage = qSelector<HTMLImageElement>(
      '.film-poster .film-poster__image', $film
    );
    $posterImage.alt = this.Title;
    $posterImage.src = DefaultValues.Poster;

    if (this.Poster !== DefaultValues.Poster) {
      $film.classList.add('film_with-poster');
    }

    const $poster = document.createElement('img');
    $poster.src = this.Poster;
    $poster.addEventListener('load', () => {
      $posterImage.src = $poster.src;
    });

    // Реальное описание
    const $description = qSelector<HTMLDivElement>(
      '.film-description__full', $film
    );

    // Рейтинг
    const $rating = qSelector<HTMLDivElement>(
      '.film-description__rating', $description
    );
    const $ratingEmoji = qSelector<HTMLDivElement>(
      '.rating-emoji', $rating
    );
    $ratingEmoji.textContent = '🤔';

    const $ratingPoints = qSelector<HTMLParagraphElement>(
      '.film-description__rating-points', $rating
    );
    $ratingPoints.textContent = this.Rating;

    if (this.Ratings.length > 0) {
      $ratingEmoji.classList.add(getRatingEmoji(this.Ratings[0]));
      $ratingEmoji.textContent = '';

      $ratingPoints.textContent = this.Ratings[0].Value;
    }

    // Название
    const $title = qSelector<HTMLParagraphElement>(
      '.film-description__title-text', $description
    );
    $title.textContent = this.Title;

    // Жанр и год
    const $genreYear = qSelector<HTMLParagraphElement>(
      '.film-description__genre-year', $description
    );

    const $genre = qSelector<HTMLParagraphElement>(
      '.film-description__genre', $genreYear
    );
    $genre.textContent = this.Genre;

    const $year = qSelector<HTMLParagraphElement>(
      '.film-description__year', $genreYear
    );
    $year.textContent = this.Year;
  }
}

customElements.define('film-card', FilmCard);