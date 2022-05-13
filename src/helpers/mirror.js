"use strict";
// FIXME Не работает
const mirror = (element, ...params) => {
    params.forEach((param) => {
        Object.defineProperty(element, param, {
            get() {
                return element.getAttribute(param);
            },
            set(value) {
                element.setAttribute(param, value);
            },
        });
    });
};
