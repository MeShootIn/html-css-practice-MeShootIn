/**
 * Асинхронный GET-запрос на сервер через fetch.
 * @param {string} url адрес.
 * @param {number} timeout таймаут в миллисекундах.
 * @returns {Promise<any>} промис, резолвящийся в JSON-объект.
 */
export default function request(
  url: string, timeout: number = 3000
): Promise<any> {
  const abortController = new AbortController();
  const timer = setTimeout(() => {
    abortController.abort();
  }, timeout);

  return fetch(url, {
    signal: abortController.signal
  })
    .then(response => {
      clearTimeout(timer);

      if (response.ok) {
        return response.json();
      }

      throw response;
    })
    .catch(err => {
      clearTimeout(timer);

      throw err;
    });
}