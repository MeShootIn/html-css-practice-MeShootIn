// FIXME Не работает
const mirror = (element: HTMLElement, ...params: string[]) => {
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
}