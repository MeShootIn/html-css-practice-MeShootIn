import qSelector from '../helpers/q-selector.js';
import enumParams from '../helpers/enum-params.js';
import styleLinks from "../helpers/style-links.js";
const $searchTagTemplate = document.createElement('template');
$searchTagTemplate.innerHTML = `
${styleLinks}

<style>
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
}

.search-tag {
  cursor: pointer;
  border-radius: 4px;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.8);
  transition: 0.5s ease-in-out;

  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.8);
}

.search-tag:hover {
  background: rgba(255, 255, 255, 1);
  transition: 0.5s ease-in-out;
}
</style>

<span class="search-tag noselect"></span>
`;
export var Params;
(function (Params) {
    Params["Tag"] = "Tag";
})(Params || (Params = {}));
export default class SearchTag extends HTMLElement {
    sr;
    constructor(tag) {
        super();
        const shadow = this.attachShadow({
            mode: 'open'
        });
        const $template = $searchTagTemplate.content.cloneNode(true);
        shadow.appendChild($template);
        this.sr = this.shadowRoot;
        this.Tag = tag;
    }
    static get observedAttributes() {
        return enumParams(Params);
    }
    get Tag() {
        return this.getAttribute(Params.Tag) || '';
    }
    set Tag(value) {
        this.setAttribute(Params.Tag, value);
    }
    connectedCallback() {
        const $span = qSelector('.search-tag', this.sr);
        $span.textContent = this.Tag;
    }
    // FIXME Ни разу не вызывался
    attributeChangedCallback(param, oldValue, newValue) {
        console.log(`attChangedCallback`); // DEBUG
        switch (param) {
            case Params.Tag:
                console.log(`case Params.Tag`); // DEBUG
                qSelector('.search-tag', this.sr)
                    .textContent = newValue;
                break;
        }
    }
}
customElements.define('search-tag', SearchTag);
