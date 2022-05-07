const qSelector = <T extends Element>(
  selector: string, obj: Element | Document | ShadowRoot = document
): T => obj.querySelector<T>(selector) as T;

export default qSelector;