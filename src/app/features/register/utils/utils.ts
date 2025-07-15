import { inject } from "@angular/core";
import { GeocodingService } from "@core/services/geocoding.service";
import { incrementDoc, withGeo } from "@shared/operators";
import { map, Observable, of } from "rxjs";
import { CandidateForm } from "../types";

export function compareCandidates(
  a: Partial<CandidateForm> | null | undefined,
  b: Partial<CandidateForm> | null | undefined
): boolean {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;

  const fields: (keyof CandidateForm)[] = [
    "fullName",
    "email",
    "phone",
    "age",
    "city",
    "hobbies",
    "motivation",
    "profileImage",
  ];

  if (!a || !b) return false;

  const comparisons = fields.map((field) => {
    const equal = a[field] === b[field];
    return equal;
  });

  return comparisons.every(Boolean);
}

export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

export function isExpired(value: Date | undefined): boolean {
  if (!isValidDate(value)) return false;

  return new Date() > value;
}
export function withCoordinates<T, K extends keyof T>(key: K) {
  const geocode = inject(GeocodingService);

  return (source$: Observable<T>) =>
    source$.pipe(
      withGeo((value) => {
        const city = value[key];

        if (typeof city !== "string" || city.trim() === "")
          return of({ lat: 0, lng: 0 });

        return geocode.loadCoordinates(city);
      })
    );
}

export function withLogRegister() {
  return incrementDoc("analytics/register");
}
// TODO: mark update as dirty, this should change teh filter flow
export function withDirty< T>(
  reference: Partial<T>,
  compareFn?: (a: T, b: Partial<T>) => boolean
) {
  const defaultCompare = (a: T, b: Partial<T>): boolean => {
    const isPrimitive = (v: any) => v === null || typeof v !== "object";
    if (isPrimitive(a) && isPrimitive(b)) {
      return a === b;
    }
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  };

  const actualCompare = compareFn ?? defaultCompare;

  return (source$: Observable<T>) =>
    source$.pipe(
      map((value) => ({
        value,
        dirty: !actualCompare(value, reference),
      }))
    );
}
