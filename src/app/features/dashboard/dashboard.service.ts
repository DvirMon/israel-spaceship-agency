import { computed, Injectable } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";

import { CandidateStore } from "@core/models/candidate.model";
import { FireStoreService } from "@core/services/fire-store.service";

@Injectable()
export class DashboardService extends FireStoreService<CandidateStore> {
  
  private readonly candidateCollection = this.loadCollection("candidates");
  
  private readonly candidateResource = rxResource({
    defaultValue: [],
    stream: () => this.candidateCollection,
  });
  
  private readonly candidates = this.candidateResource.value;
  readonly isLoading = this.candidateResource.isLoading;
  readonly data = this.candidates.asReadonly();
  readonly totalCandidates = computed(() => this.data().length);

}
