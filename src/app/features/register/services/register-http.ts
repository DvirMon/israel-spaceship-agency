import { inject, Injectable } from "@angular/core";
import { CandidateStore } from "@core/models/candidate-store.model";
import { FireStoreService } from "@core/services/fire-store.service";
import { GeocodingService } from "@core/services/geocoding.service";
import { LocalStorage } from "@core/services/local-storage.service";
import { LoadingOverlayService } from "app/shared/components/loading-overlay/loading-overlay.service";
import { withLoadingOverlay } from "app/shared/components/loading-overlay/operator";
import { map, tap } from "rxjs";

@Injectable()
export class RegisterHttp extends FireStoreService<CandidateStore> {
  private readonly localStorage = inject(LocalStorage);
  private readonly geocoding = inject(GeocodingService);

  private readonly overlayService = inject(LoadingOverlayService);
  createCandidate(
    data: Omit<CandidateStore, "id">
  ) {
    // TODO - add flow to save image at storage

    return this.createDocument(data).pipe(
      withLoadingOverlay(this.overlayService),
      tap((data) => {
        // this.localStorage.setItem("registration-uuid", data.id);
      })
    );
  }

  updateCandidate(data: CandidateStore) {
    return this.updateDocument(data.id, data).pipe(
      map(() => null), // mock value
      withLoadingOverlay(this.overlayService)
    );
  }
}
