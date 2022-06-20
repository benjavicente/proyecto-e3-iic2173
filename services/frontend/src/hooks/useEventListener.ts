import { MutableRefObject, useEffect } from "react";

/*
 * useEventListener Hook
 * ---------------------
 * Adds an event listener to a DOM element.
 * Useful for listening events that are not in the React API.
 */
export default function useEventListener<K extends keyof HTMLElementEventMap, E extends HTMLElement>(
  elementReference: MutableRefObject<E | null>,
  type: K,
  listener: (event: HTMLElementEventMap[K], element: E) => any
) {
  useEffect(() => {
    const element = elementReference.current;
    if (!element) return;

    const eventListener = (event: HTMLElementEventMap[K]) => listener(event, element);

    element.addEventListener(type, eventListener);
    return () => element.removeEventListener(type, eventListener);
  }, [elementReference, type, listener]);
}
