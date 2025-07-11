import { inject } from "@angular/core";
import { GeocodingService } from "@core/services/geocoding.service";
import { withGeo } from "app/shared/operators";
import { Observable, of } from "rxjs";
import { CandidateForm } from "../models/register.model";

export function compareCandidates(
  a: Partial<CandidateForm> | null,
  b: Partial<CandidateForm> | null
): boolean {
  // If both are null, they're equal
  if (a === null && b === null) return true;

  // If one is null and the other isn't, they're not equal
  if (a === null || b === null) return false;

  // Compare all text fields
  const textFieldsEqual =
    a.fullName === b.fullName &&
    a.email === b.email &&
    a.phone === b.phone &&
    a.age === b.age &&
    a.city === b.city &&
    a.hobbies === b.hobbies &&
    a.motivation === b.motivation;
  a.profileImage === b.profileImage;

  return textFieldsEqual;
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
