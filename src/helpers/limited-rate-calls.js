/**
 * Вызывает функции, одновременно вызываемое количество которых ограничено, из
 * массива.
 * @param  {WrapFn<T>[]} fns массив с функциями-обёртками, возвращающими
 * промисы, резолвящиеся в объекты типа T.
 * @param  {number} maxCalls максимальное количество одновременных вызовов.
 * @return {Promise<T>[]} массив промисов, резолвящихся в объекты типа T.
 */
export default function limitedRateCalls(fns, maxCalls = 1) {
    const results = [];
    if (fns.length < maxCalls) {
        maxCalls = fns.length;
    }
    const callPromises = [];
    for (let i = 0; i < maxCalls; ++i) {
        results[i] = callPromises[i % maxCalls] = fns[i]();
    }
    for (let i = maxCalls; i < fns.length; ++i) {
        results[i] = callPromises[i % maxCalls] =
            callPromises[i % maxCalls].then(() => fns[i]());
    }
    return results;
}
