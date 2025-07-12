import { tap } from "rxjs/operators";
import { defer, Observable, of } from "rxjs";
import { isDevMode } from "@angular/core";

function isObjectLike(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPrimitive(
  value: unknown
): value is string | number | boolean | null {
  return (
    value === null || ["string", "number", "boolean"].includes(typeof value)
  );
}

export function setLocalStorage<T>(key: string, value: unknown) {
  const serialized = isPrimitive(value) ? String(value) : JSON.stringify(value);
  localStorage.setItem(key, serialized);
}

export function writeTotLocalStorage<T>(
  key: string,
  pickFn?: (value: T & Record<string, unknown>) => unknown
) {
  return (source$: Observable<T>) =>
    source$.pipe(
      tap((value) => {
        try {
          const valueToStore =
            isObjectLike(value) && pickFn ? pickFn(value) : value;
          
          setLocalStorage(key, valueToStore);
        } catch (error) {
          console.error(`Error setting item for key "${key}":`, error);
        }
      })
    );
}

  export function getItem<T>(key: string): T | null {
    try {
      // if (!this.isLocalStorageAvailable()) return null;

      const item = localStorage.getItem(key);
      if (!item || item === "undefined") return null;

      // If item looks like JSON (starts with `{` or `[`), parse it
      if (/^\s*[{[]/.test(item)) {
        return JSON.parse(item) as T;
      }

      if (!isDevMode()) return null;

      // Otherwise return primitive types as-is (string, number, boolean)
      return item as unknown as T;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      localStorage.removeItem(key); // Optional: cleanup bad value
      return null;
    }
  }
