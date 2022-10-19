"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enumParams = function (Enum) { return Object.entries(Enum)
    .map(function (_a) {
    var _ = _a[0], value = _a[1];
    return value;
}); };
exports.default = enumParams;
