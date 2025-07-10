import { Injectable, computed, effect, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class LoadingOverlayService {
  private readonly _loading = signal(false);

  readonly isLoading = computed(() => this._loading());

  show(): void {
    this._loading.set(true);
  }

  close(): void {
    this._loading.set(false);
  }

}
