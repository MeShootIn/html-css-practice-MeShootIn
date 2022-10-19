"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getSearchTags = function () { return JSON.parse(localStorage.getItem('search-tags') || '[]'); };
exports.default = getSearchTags;
