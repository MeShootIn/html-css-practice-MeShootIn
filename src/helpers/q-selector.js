"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var qSelector = function (selector, obj) {
    if (obj === void 0) { obj = document; }
    return obj.querySelector(selector);
};
exports.default = qSelector;
