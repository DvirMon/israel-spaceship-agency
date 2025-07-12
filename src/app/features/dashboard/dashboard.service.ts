import { computed, Injectable } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";

import { CandidateStore } from "@core/models/candidate.model";
import { FireStore } from "@core/services/fire-store.service";

@Injectable()
export class DashboardService extends FireStore<CandidateStore> {
  private readonly candidateCollection = this.loadCollection("candidates");

 

  private readonly candidateResource = rxResource({
    defaultValue: [],
    stream: () => this.candidateCollection,
  });


  readonly isLoading = this.candidateResource.isLoading;
  readonly candidates = this.candidateResource.value.asReadonly();
  readonly totalCandidates = computed(() => this.candidates().length);

}
