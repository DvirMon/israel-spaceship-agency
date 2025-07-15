import { OperatorFunction } from "rxjs";
import { map } from "rxjs";

export function withTimestamps<T>(): OperatorFunction<
  T,
  T & {
    registeredAt: Date;
    expiresAt: Date;
  }
> {
  return (source$) =>
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


export function geTimeStamp() {

}
