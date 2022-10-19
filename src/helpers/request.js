"use strict";
Object.defineProperty(exports, "__esModule", {value: true});

/**
 * Асинхронный GET-запрос на сервер через fetch.
 * @param {string} url адрес.
 * @param {number} timeout таймаут в миллисекундах.
 * @returns {Promise<any>} промис, резолвящийся в JSON-объект.
 */
function request(url, timeout) {
  if (timeout === void 0) {
    timeout = 3000;
  }
  var abortController = new AbortController();
  var timer = setTimeout(function () {
    abortController.abort();
  }, timeout);
  return fetch(url, {
    signal: abortController.signal
  })
    .then(function (response) {
      clearTimeout(timer);
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .catch(function (err) {
      clearTimeout(timer);
      throw err;
    });
}

exports.default = request;
