import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { CandidateStore } from "@core/models/candidate.model";
import { IS_MOBILE } from "@core/tokens/mobile";
import { DashboardService } from "../dashboard.service";
import {
  matchesAgeFilter,
  matchesCity,
  matchesDateFilter,
  matchesSearch,
} from "./candidates.utils";
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
})
export class Candidates {
  private readonly dashboardService = inject(DashboardService);
  private readonly dialog = inject(MatDialog);
  readonly isMobile = inject(IS_MOBILE);

  // Filter signals
  readonly searchTerm = signal("");
  readonly statusFilter = signal("all");
  readonly cityFilter = signal("all");
  readonly ageFilter = signal("all");
  readonly dateFilter = signal("all");
  readonly sortBy = signal("name");

  // View mode and loading signals
  readonly loading = this.dashboardService.isLoading;
  readonly candidates = this.dashboardService.candidates;
  readonly totalCandidates = this.dashboardService.totalCandidates;
  readonly viewMode = linkedSignal({
    source: this.isMobile,
    computation: (isMobile) => (isMobile ? "grid" : "table"),
  });

  // Computed filter state
  readonly filters = computed(
    (): FilterState => ({
      searchTerm: this.searchTerm(),
      statusFilter: this.statusFilter(),
      cityFilter: this.cityFilter(),
      ageFilter: this.ageFilter(),
      dateFilter: this.dateFilter(),
      sortBy: this.sortBy(),
    })
  );

  // Computed filtered candidates
  readonly filteredCandidates = computed(() => {
    const candidates = this.candidates();
    const filters = {
      search: this.searchTerm().toLowerCase(),
      status: this.statusFilter(),
      city: this.cityFilter(),
      age: this.ageFilter(),
      date: this.dateFilter(),
    };

    return candidates.filter((candidate) => {
      const conditions = [
        matchesSearch(candidate, filters.search),
        matchesCity(candidate, filters.city),
        matchesAgeFilter(candidate.age, filters.age),
        matchesDateFilter(candidate.registeredAt, filters.date),
      ];

      return conditions.every(Boolean);
    });
  });

  private readonly filterResetMap: Record<keyof FilterState, () => void> = {
    searchTerm: () => this.searchTerm.set(""),
    statusFilter: () => this.statusFilter.set("all"),
    cityFilter: () => this.cityFilter.set("all"),
    ageFilter: () => this.ageFilter.set("all"),
    dateFilter: () => this.dateFilter.set("all"),
    sortBy: () => this.sortBy.set("name"),
  };

   constructor() {
    effect(() => {
      this.viewCandidateDetail(this.candidates()[0]);
    });
  }

  onRemoveFilter(key: keyof FilterState): void {
    this.filterResetMap[key]?.();
  }

  clearFilters(): void {
    (Object.keys(this.filterResetMap) as (keyof FilterState)[]).forEach(
      (key) => {
        this.filterResetMap[key]();
      }
    );
  }

  toggleViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  viewCandidateDetail(candidate: CandidateStore): void {
    this.dialog.open(CandidateDetailsDialog, {
      data: { id: candidate.id, candidates: this.candidates() },
      width: "800px",

      disableClose: true,
    });
  }
}
