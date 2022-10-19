"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSearchTag = exports.addSearchTag = void 0;
var q_selector_js_1 = require("../helpers/q-selector.js");
var search_tag_js_1 = require("./search-tag.js");
var get_search_tags_js_1 = require("../helpers/get-search-tags.js");
var style_links_js_1 = require("../helpers/style-links.js");
/**
 * Добавляет тег в список, который обновляется в LS и ререндерится в HTML
 */
function addSearchTag($searchTagContainer, target) {
    removeSearchTag($searchTagContainer, target);
    var searchTags = (0, get_search_tags_js_1.default)();
    searchTags.unshift(target);
    localStorage.setItem('search-tags', JSON.stringify(searchTags));
    $searchTagContainer.render();
}
exports.addSearchTag = addSearchTag;
/**
 * Удаляет тег из списка, который обновляется в LS и ререндерится в HTML
 */
function removeSearchTag($searchTagContainer, target) {
    var searchTags = (0, get_search_tags_js_1.default)();
    var index = searchTags
        .map(function (tag) { return tag.toLowerCase(); })
        .indexOf(target.toLowerCase());
    if (index === -1) {
        return;
    }
    searchTags.splice(index, 1);
    localStorage.setItem('search-tags', JSON.stringify(searchTags));
    $searchTagContainer.render();
}
exports.removeSearchTag = removeSearchTag;
var $searchTagContainerTemplate = document.createElement('template');
$searchTagContainerTemplate.innerHTML = "\n".concat(style_links_js_1.default, "\n\n<style>\n.container {\n  display: flex;\n  justify-content: flex-start;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n</style>\n\n<div class=\"container\"></div>\n");
var SearchTagContainer = /** @class */ (function (_super) {
    __extends(SearchTagContainer, _super);
    function SearchTagContainer() {
        var _this = _super.call(this) || this;
        var shadow = _this.attachShadow({
            mode: 'open'
        });
        var $template = $searchTagContainerTemplate.content.cloneNode(true);
        shadow.appendChild($template);
        _this.sr = _this.shadowRoot;
        return _this;
    }
    SearchTagContainer.prototype.connectedCallback = function () {
        this.render();
    };
    SearchTagContainer.prototype.render = function () {
        var _this = this;
        var $container = (0, q_selector_js_1.default)('.container', this.sr);
        $container.innerHTML = '';
        var searchTags = (0, get_search_tags_js_1.default)();
        var _loop_1 = function (tag) {
            var $searchTag = new search_tag_js_1.default(tag);
            var timer;
            $searchTag.addEventListener('click', function (event) {
                event.preventDefault();
                if (event.detail === 1) {
                    timer = setTimeout(function () {
                        var $input = (0, q_selector_js_1.default)('.search-form__input');
                        $input.value = $searchTag.Tag;
                        var $button = (0, q_selector_js_1.default)('.search-form__button');
                        $button.click();
                    }, 300);
                }
            });
            $searchTag.addEventListener('dblclick', function (event) {
                event.preventDefault();
                clearTimeout(timer);
                removeSearchTag(_this, $searchTag.Tag);
            });
            $container.appendChild($searchTag);
        };
        for (var _i = 0, searchTags_1 = searchTags; _i < searchTags_1.length; _i++) {
            var tag = searchTags_1[_i];
            _loop_1(tag);
        }
    };
    return SearchTagContainer;
}(HTMLElement));
exports.default = SearchTagContainer;
customElements.define('search-tag-container', SearchTagContainer);
