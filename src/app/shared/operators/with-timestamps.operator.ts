import { Timestamp } from "@angular/fire/firestore";
import { map, Observable } from "rxjs";
export function withTimestamps<T>() {
  return (source$: Observable<T>) =>
    source$.pipe(
      map((value) => {
        const now = new Date();
        const registeredAt = Timestamp.fromDate(now);
        const expiresAt = Timestamp.fromDate(
          new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
        );

        return {
          ...value,
          registeredAt,
          expiresAt,
        };
      })
    );
}