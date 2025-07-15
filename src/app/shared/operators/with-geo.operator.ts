import { GeoPoint } from "@angular/fire/firestore";
import { Observable, OperatorFunction, map, switchMap } from "rxjs";

export function withGeo<T>(
  getGeo: (source: T) => Observable<{ lat: number; lng: number }>
) {
  return (source$ : Observable<T>) =>
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
