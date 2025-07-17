import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { CandidateStore } from "@core/models/candidate.model";
import { IS_MOBILE } from "@core/tokens/mobile";
import { CandidateService } from "./candidates.service";
import { CandidateDetailsDialog } from "./components/candidate-details-dialog/candidate-details-dialog";
import { CandidateFilters } from "./components/candidate-filters/candidate-filters";
import { FilterState } from "./components/candidate-filters/types";
import { CandidateGrid } from "./components/candidate-grid/candidate-grid";
import { CandidateTable } from "./components/candidate-table/candidate-table";

export type ViewMode = "grid" | "table";

const materialImports = [MatCardModule, MatIconModule, MatDialogModule];

const componentsImports = [CandidateFilters, CandidateTable, CandidateGrid];

@Component({
  selector: "app-candidates",
  imports: [materialImports, componentsImports],
  templateUrl: "./candidates.html",
  styleUrl: "./candidates.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CandidateService],  
})
export class Candidates {
  private readonly candidateService = inject(CandidateService);
  private readonly dialog = inject(MatDialog);
  readonly isMobile = inject(IS_MOBILE);

  // Filter signals
  readonly searchTerm = this.candidateService.searchTerm
  readonly statusFilter = this.candidateService.ageFilter
  readonly cityFilter = this.candidateService.cityFilter
  readonly ageFilter = this.candidateService.ageFilter
  readonly dateFilter = this.candidateService.dateFilter

  // View mode and loading signals
  readonly loading = this.candidateService.loading;
  readonly candidates = this.candidateService.candidates;
  readonly totalCandidates = this.candidateService.totalCandidates;
  readonly viewMode = linkedSignal({
    source: this.isMobile,
    computation: (isMobile) => (isMobile ? "grid" : "table"),
  });

  readonly filters = this.candidateService.filters

  readonly filteredCandidates = this.candidateService.filteredCandidates

  onRemoveFilter(key: keyof FilterState): void {
    this.candidateService.filterResetMap[key]?.();
  }

  clearFilters(): void {
    (Object.keys(this.candidateService.filterResetMap) as (keyof FilterState)[]).forEach(
      (key) => {
        this.candidateService.filterResetMap[key]();
      }
    );
  }

  toggleViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  viewCandidateDetail(candidate: CandidateStore): void {
    this.dialog.open(CandidateDetailsDialog, {
      data: { id: candidate.id, candidates: this.candidates() },
      width: "inherit",
      height: "650px",
      backdropClass: "details-backdrop",
    });
  }
}
