import { inject } from "@angular/core";
import {
  doc,
  Firestore,
  increment,
  runTransaction,
  setDoc,
} from "@angular/fire/firestore";
import { defer, map, Observable, switchMap } from "rxjs";

export function incrementDoc(path: string) {
  const firestore = inject(Firestore);

  return <T>(source$: Observable<T>): Observable<T> =>
    source$.pipe(
      switchMap((value) =>
        defer(() =>
          runTransaction(firestore, async (tx) => {
            const ref = doc(firestore, path);
            tx.update(ref, { count: increment(1) });
          }).catch(async (err) => {
            if (err.code === "not-found") {
              await setDoc(doc(firestore, path), { count: 1 });
            }
          })
        ).pipe(map(() => value))
      )
    );
}
