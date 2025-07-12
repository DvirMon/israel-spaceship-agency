import { tap } from "rxjs/operators";
import { defer, Observable, of } from "rxjs";

export function setLocalStorage<T>(
  key: string,
  pickFn?: (value: T) => any
) {
  return (source$: Observable<T>) =>
    source$.pipe(
      tap((value) => {
        try {
          const valueToStore = pickFn ? pickFn(value) : value;
          localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(`Error setting item for key "${key}":`, error);
        }
      })
    );
}

export function getLocalStorage<T>(key: string) {
  return defer(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item || item === "undefined") return of(null);

      if (/^\s*[{[]/.test(item)) {
        return of(JSON.parse(item) as T);
      }

      return of(item as unknown as T);
    } catch (error) {
      console.error(`Error getting item for key "${key}":`, error);
      return of(null);
    }
  });
}

export function hasLocalStorageItem(key: string) {
  return defer(() => {
    try {
      return of(localStorage.getItem(key) !== null);
    } catch (error) {
      console.error(`Error checking key "${key}":`, error);
      return of(false);
    }
  });
}
