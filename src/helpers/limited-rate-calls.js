"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Вызывает функции, одновременно вызываемое количество которых ограничено, из
 * массива.
 * @param  {WrapFn<T>[]} fns массив с функциями-обёртками, возвращающими
 * промисы, резолвящиеся в объекты типа T.
 * @param  {number} maxCalls максимальное количество одновременных вызовов.
 * @return {Promise<T>[]} массив промисов, резолвящихся в объекты типа T.
 */
function limitedRateCalls(fns, maxCalls) {
    if (maxCalls === void 0) { maxCalls = 1; }
    var results = [];
    if (fns.length < maxCalls) {
        maxCalls = fns.length;
    }
    var callPromises = [];
    for (var i = 0; i < maxCalls; ++i) {
        results[i] = callPromises[i % maxCalls] = fns[i]();
    }
    var _loop_1 = function (i) {
        results[i] = callPromises[i % maxCalls] =
            callPromises[i % maxCalls].then(function () { return fns[i](); });
    };
    for (var i = maxCalls; i < fns.length; ++i) {
        _loop_1(i);
    }
    return results;
}
exports.default = limitedRateCalls;
