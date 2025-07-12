import { inject, Injectable } from "@angular/core";
import { CandidateStore } from "@core/models/candidate.model";
import { FireStore } from "@core/services/fire-store.service";
import { mapTimestampsToDate } from "@shared/operators";
import { writeTotLocalStorage } from "@shared/operators/local-storage";
import { LoadingOverlayService } from "app/shared/components/loading-overlay/loading-overlay.service";
import { withLoadingOverlay } from "app/shared/components/loading-overlay/operator";
import { map, take } from "rxjs";

@Injectable()
export class RegisterHttp extends FireStore<CandidateStore> {
  private readonly overlayService = inject(LoadingOverlayService);

  createCandidate(data: Omit<CandidateStore, "id">) {
    return this.createDocument(data).pipe(
      withLoadingOverlay(this.overlayService),
      writeTotLocalStorage("registration-uuid", (data) => data.id)
    );
  }

  updateCandidate(data: CandidateStore) {
    return this.updateDocument(data.id, data).pipe(
      withLoadingOverlay(this.overlayService),
      map(() => data)
    );
  }

  getCandidate(id: string) {
 

  return this.getDocumentById(id).pipe(
      take(1),
      map((candidate) => candidate as CandidateStore),
      mapTimestampsToDate(["registeredAt", "expiresAt"]),
      withLoadingOverlay(this.overlayService)
    );
  }
}
