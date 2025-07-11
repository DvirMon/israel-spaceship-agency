import { inject, isDevMode } from "@angular/core";
import { GeocodingService } from "@core/services/geocoding.service";
import { withGeo } from "app/shared/operators";
import { Observable, of } from "rxjs";
import { CandidateForm } from "../types";

export function compareCandidates(
  a: Partial<CandidateForm> | null,
  b: Partial<CandidateForm> | null
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

  const comparisons = fields.map((field) => {
    const equal = a[field] === b[field];

    if (isDevMode()) {
      // console.log(`[compareCandidates] Field mismatch: ${field}`);
      // console.log('  A:', a[field]);
      // console.log('  B:', b[field]);
    }

    return equal;
  });

  if (isDevMode()) {
    console.log("[compareCandidates] Comparisons:", comparisons);
  }

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
