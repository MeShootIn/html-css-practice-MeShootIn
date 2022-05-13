/**
 * Ключи OMDb:
 * 7ea4aa35
 * da979bab
 */
import OmdbApi, {ApiResponse, ByIdResponse} from './src/api/omdb-api.js';
import {bySearchAll} from './src/helpers/api-requests.js';
import FilmCard from './src/components/film-card.js';
import qSelector from './src/helpers/q-selector.js';
import SearchTagContainer, {
  addSearchTag
} from "./src/components/search-tag-container.js";


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

const API_KEY = 'da979bab';
const api = new OmdbApi(API_KEY);

const $searchTagContainer = new SearchTagContainer();
qSelector<HTMLDivElement>('.search-form__tags')
  .appendChild($searchTagContainer);

qSelector<HTMLInputElement>('.search-form')
  .addEventListener('submit', (event) => {
    event.preventDefault();

    const $input = qSelector<HTMLInputElement>('.search-form__input');
    $input.value = $input.value.replace(/ +/g, ' ').trim();

    const inputValue = $input.value;

    addSearchTag($searchTagContainer, inputValue);
    runSearch(inputValue.toLowerCase());
  });

async function runSearch(title: string) {
  function checkResponse(apiResponse: ApiResponse) {
    if (apiResponse.Response === 'False') {
      throw new Error(apiResponse.Error);
    }
  }

  const $resultsResume = qSelector<HTMLParagraphElement>(
    '.results__resume'
  );

  try {
    const $resultContainer = qSelector<HTMLDivElement>(
      '.result-container'
    );
    $resultContainer.innerHTML = '';

    const result = await bySearchAll(
      api, title, window.navigator.hardwareConcurrency
    );
    const firstResponse = await result.BySearchPromises[0];

    checkResponse(firstResponse);

    const totalResults = +firstResponse.totalResults;
    $resultsResume.textContent = `Нашли ${totalResults} фильмов(-ма)`;

    for (const promise of result.BySearchPromises) {
      promise.then(bySearchResponse => {
        checkResponse(bySearchResponse);

        bySearchResponse.Search.forEach(async (shortInfo) => {
          let byIdResponse: ByIdResponse;
          const id = shortInfo.imdbID;
          const item = localStorage.getItem(id);

          if (item === null) {
            byIdResponse = await api.byId(id);

            localStorage.setItem(id, JSON.stringify(byIdResponse));
          } else {
            byIdResponse = JSON.parse(item);
          }

          checkResponse(byIdResponse);
          $resultContainer.appendChild(
            new FilmCard(
              byIdResponse.Title,
              byIdResponse.Year,
              byIdResponse.Poster,
              byIdResponse.Ratings,
              byIdResponse.Genre,
              `https://www.imdb.com/title/${shortInfo.imdbID}/`
            )
          );
        });
      });
    }
  } catch (_) {
    $resultsResume.textContent = 'Что-то пошло не так ¯\\_(ツ)_/¯';
  }
}