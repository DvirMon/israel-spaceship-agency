import { incrementDoc } from "@shared/operators";
import { EMPTY, Observable, of, switchMap, tap } from "rxjs";

function getTodayId(): string {
  return new Date().toISOString().split("T")[0];
}
export function withLogDailyVisit() {
  const today = getTodayId();
  const sessionKey = "daily_visit_logged_" + today;
  return <T>(source$: Observable<T>): Observable<T> =>
    source$.pipe(
      hasSession(sessionKey),
      incrementDoc("analytics/visits"),
      writeToSession(sessionKey, true)
    );
}

export function writeToSession(key: string, value: unknown) {
  return <T>(source$: Observable<T>): Observable<T> =>
    source$.pipe(tap(() => sessionStorage.setItem(key, JSON.stringify(value))));
}

export function hasSession(key: string) {
  return <T>(source$: Observable<T>): Observable<T> =>
    source$.pipe(
      switchMap((value) => {
        const exists = sessionStorage.getItem(key);
        return exists ? EMPTY : of(value);
      })
    );
}
