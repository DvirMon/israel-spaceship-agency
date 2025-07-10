import { finalize, map, Observable, OperatorFunction, switchMap } from "rxjs";
import { LoadingOverlayService } from "./loading-overlay.service";
import { inject } from "@angular/core";
import { GeocodingService } from "@core/services/geocoding.service";
import { GeoPoint } from "@angular/fire/firestore";

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

export function withCoordinates<T extends { city: string }>() {
  const geocode = inject(GeocodingService);
  return (source$: Observable<T>) =>
    source$.pipe(withGeo(({ city }) => geocode.loadCoordinates(city)));
}
