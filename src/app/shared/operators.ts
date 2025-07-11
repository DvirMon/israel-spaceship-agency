import { GeoPoint, Timestamp } from "@angular/fire/firestore";
import { Observable, OperatorFunction, map, switchMap } from "rxjs";

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

export function convertTimestampsToDate<T>(keys: (keyof T)[]) {
  return (source$: Observable<T>) =>
    source$.pipe(
      map((data): T => {
        if (!data || typeof data !== "object") return data;

        const result = { ...data };

        for (const key of keys) {
          const value = result[key];

          const shouldConvert = value instanceof Timestamp;

          if (shouldConvert) {
            result[key] = value.toDate() as any;
          }
        }

        return result as T;
      })
    );
}
