import { inject, signal, computed } from "@angular/core";
import { DashboardService } from "../dashboard.service";
import {
  matchesSearch,
  matchesCity,
  matchesAgeFilter,
  matchesDateFilter,
} from "./candidates.utils";
import { FilterState } from "./components/candidate-filters/types";

export class CandidateService {
  private readonly dashboardService = inject(DashboardService);

  // Filter signals
  readonly searchTerm = signal("");
  readonly statusFilter = signal("all");
  readonly cityFilter = signal("all");
  readonly ageFilter = signal("all");
  readonly dateFilter = signal("all");
  readonly sortBy = signal("name");

  readonly totalCandidates = this.dashboardService.totalCandidates;

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
    const candidates = this.dashboardService.data();
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

  readonly filterResetMap: Record<keyof FilterState, () => void> = {
    searchTerm: () => this.searchTerm.set(""),
    statusFilter: () => this.statusFilter.set("all"),
    cityFilter: () => this.cityFilter.set("all"),
    ageFilter: () => this.ageFilter.set("all"),
    dateFilter: () => this.dateFilter.set("all"),
    sortBy: () => this.sortBy.set("name"),
  };
}
