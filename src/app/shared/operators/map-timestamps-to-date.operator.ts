import { Timestamp } from "@angular/fire/firestore";
import { Observable, map } from "rxjs";

export function mapTimestampsToDate<T>(keys: (keyof T)[]) {
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
