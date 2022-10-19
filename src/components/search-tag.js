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
exports.Params = void 0;
var q_selector_js_1 = require("../helpers/q-selector.js");
var enum_params_js_1 = require("../helpers/enum-params.js");
var style_links_js_1 = require("../helpers/style-links.js");
var $searchTagTemplate = document.createElement('template');
$searchTagTemplate.innerHTML = "\n".concat(style_links_js_1.default, "\n\n<style>\n.noselect {\n  -webkit-touch-callout: none; /* iOS Safari */\n  -webkit-user-select: none; /* Safari */\n  -khtml-user-select: none; /* Konqueror HTML */\n  -moz-user-select: none; /* Old versions of Firefox */\n  -ms-user-select: none; /* Internet Explorer/Edge */\n  user-select: none;\n}\n\n.search-tag {\n  cursor: pointer;\n  border-radius: 4px;\n  padding: 6px 16px;\n  background: rgba(255, 255, 255, 0.8);\n  transition: 0.5s ease-in-out;\n\n  font-weight: 400;\n  font-size: 16px;\n  line-height: 24px;\n  color: rgba(0, 0, 0, 0.8);\n}\n\n.search-tag:hover {\n  background: rgba(255, 255, 255, 1);\n  transition: 0.5s ease-in-out;\n}\n</style>\n\n<span class=\"search-tag noselect\"></span>\n");
var Params;
(function (Params) {
    Params["Tag"] = "Tag";
})(Params = exports.Params || (exports.Params = {}));
var SearchTag = /** @class */ (function (_super) {
    __extends(SearchTag, _super);
    function SearchTag(tag) {
        var _this = _super.call(this) || this;
        var shadow = _this.attachShadow({
            mode: 'open'
        });
        var $template = $searchTagTemplate.content.cloneNode(true);
        shadow.appendChild($template);
        _this.sr = _this.shadowRoot;
        _this.Tag = tag;
        return _this;
    }
    Object.defineProperty(SearchTag, "observedAttributes", {
        get: function () {
            return (0, enum_params_js_1.default)(Params);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SearchTag.prototype, "Tag", {
        get: function () {
            return this.getAttribute(Params.Tag) || '';
        },
        set: function (value) {
            this.setAttribute(Params.Tag, value);
        },
        enumerable: false,
        configurable: true
    });
    SearchTag.prototype.connectedCallback = function () {
        var $span = (0, q_selector_js_1.default)('.search-tag', this.sr);
        $span.textContent = this.Tag;
    };
    // FIXME Ни разу не вызывался
    SearchTag.prototype.attributeChangedCallback = function (param, oldValue, newValue) {
        console.log("attChangedCallback"); // DEBUG
        switch (param) {
            case Params.Tag:
                console.log("case Params.Tag"); // DEBUG
                (0, q_selector_js_1.default)('.search-tag', this.sr)
                    .textContent = newValue;
                break;
        }
    };
    return SearchTag;
}(HTMLElement));
exports.default = SearchTag;
customElements.define('search-tag', SearchTag);
