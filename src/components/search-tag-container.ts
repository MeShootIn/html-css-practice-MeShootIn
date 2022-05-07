import qSelector from "../helpers/q-selector.js";
import SearchTag from "./search-tag.js";
import getSearchTags from "../helpers/get-search-tags.js";
import styleLinks from "../helpers/style-links.js";


/**
 * Добавляет тег в список, который обновляется в LS и ререндерится в HTML
 */
export function addSearchTag($searchTagContainer: SearchTagContainer, target: string) {
  removeSearchTag($searchTagContainer, target);

  const searchTags = getSearchTags();
  searchTags.unshift(target);

  localStorage.setItem('search-tags', JSON.stringify(searchTags));
  $searchTagContainer.render();
}

/**
 * Удаляет тег из списка, который обновляется в LS и ререндерится в HTML
 */
export function removeSearchTag($searchTagContainer: SearchTagContainer, target: string) {
  const searchTags = getSearchTags();
  const index = searchTags
    .map(tag => tag.toLowerCase())
    .indexOf(target.toLowerCase());

  if (index === -1) {
    return;
  }

  searchTags.splice(index, 1);
  localStorage.setItem('search-tags', JSON.stringify(searchTags));
  $searchTagContainer.render();
}

const $searchTagContainerTemplate = document.createElement('template');
$searchTagContainerTemplate.innerHTML = `
${styleLinks}

<style>
.container {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 8px;
}
</style>

<div class="container"></div>
`;

export default class SearchTagContainer extends HTMLElement {
  private readonly sr: ShadowRoot;

  constructor() {
    super();

    const shadow = this.attachShadow({
      mode: 'open'
    });
    const $template = $searchTagContainerTemplate.content.cloneNode(true);
    shadow.appendChild($template);

    this.sr = this.shadowRoot as ShadowRoot;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const $container = qSelector<HTMLDivElement>(
      '.container', this.sr
    );
    $container.innerHTML = '';

    const searchTags = getSearchTags();

    for (let tag of searchTags) {
      const $searchTag = new SearchTag(tag);
      let timer: number;

      $searchTag.addEventListener('click', (event) => {
        event.preventDefault();

        if (event.detail === 1) {
          timer = setTimeout(() => {
            const $input = qSelector<HTMLInputElement>(
              '.search-form__input'
            );
            $input.value = $searchTag.Tag;

            const $button = qSelector<HTMLButtonElement>(
              '.search-form__button'
            );
            $button.click();
          }, 300);
        }
      });
      $searchTag.addEventListener('dblclick', (event) => {
        event.preventDefault();
        clearTimeout(timer);
        removeSearchTag(this, $searchTag.Tag);
      });

      $container.appendChild($searchTag);
    }
  }
}

customElements.define('search-tag-container', SearchTagContainer);