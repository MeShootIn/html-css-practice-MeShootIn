// TODO Дока к type + ссылка на неё в доке для limitedRateCalls
export type WrapFn<T> = () => Promise<T>; // Функция-обёртка

/**
 * Вызывает функции, одновременно вызываемое количество которых ограничено, из
 * массива.
 * @param  {WrapFn<T>[]} fns массив с функциями-обёртками, возвращающими
 * промисы, резолвящиеся в объекты типа T.
 * @param  {number} maxCalls максимальное количество одновременных вызовов.
 * @return {Promise<T>[]} массив промисов, резолвящихся в объекты типа T.
 */
export default function limitedRateCalls<T>(
  fns: WrapFn<T>[], maxCalls: number = 1
): Promise<T>[] {
  const results: Promise<T>[] = [];

  if (fns.length < maxCalls) {
    maxCalls = fns.length;
  }

  const callPromises: Promise<T>[] = [];

  for (let i = 0; i < maxCalls; ++i) {
    results[i] = callPromises[i % maxCalls] = fns[i]();
  }

  for (let i = maxCalls; i < fns.length; ++i) {
    results[i] = callPromises[i % maxCalls] =
      callPromises[i % maxCalls].then(() => fns[i]());
  }

  return results;
}