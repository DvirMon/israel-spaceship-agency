import { inject } from "@angular/core";
import { GeoPoint } from "@angular/fire/firestore";
import { GeocodingService } from "@core/services/geocoding.service";
import {
  finalize,
  map,
  Observable,
  of,
  OperatorFunction,
  switchMap
} from "rxjs";
import { LoadingOverlayService } from "./loading-overlay.service";

export function withLoadingOverlay<T>(
  overlay: LoadingOverlayService
): OperatorFunction<T, T> {
  // Show the spinner immediately in the injection context
  overlay.show();

  return (source$: Observable<T>) =>
    source$.pipe(finalize(() => overlay.close()));
}

export function withTimestamps<T>(): OperatorFunction<
  T,
  T & {
    registeredAt: Date;
    expiresAt: Date;
  }
> {
  return (source$: Observable<T>) =>
    source$.pipe(
      map((value) => {
        const registeredAt = new Date();
        const expiresAt = new Date(
          registeredAt.getTime() + 3 * 24 * 60 * 60 * 1000
        );

        return {
          ...value,
          registeredAt,
          expiresAt,
        };
      })
    );
}

export function withGeo<T>(
  getGeo: (source: T) => Observable<{ lat: number; lng: number }>
): OperatorFunction<T, T & { geo: { latitude: number; longitude: number } }> {
  return (source$: Observable<T>) =>
    source$.pipe(
      switchMap((value) =>
        getGeo(value).pipe(
          map(({ lat, lng }) => ({
            ...value,
            geo: new GeoPoint(lat, lng),
          }))
        )
      )
    );
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
