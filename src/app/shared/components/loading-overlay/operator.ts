import { finalize, Observable, OperatorFunction } from "rxjs";
import { LoadingOverlayService } from "./loading-overlay.service";

export function withLoadingOverlay<T>(
  overlay: LoadingOverlayService
): OperatorFunction<T, T> {
  // Show the spinner immediately in the injection context
  overlay.show();

  return (source$: Observable<T>) =>
    source$.pipe(finalize(() => overlay.close()));
}
