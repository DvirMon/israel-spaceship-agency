import { computed, inject, signal } from "@angular/core";
import { DashboardStore } from "../dashboard.service";
import {
  matchesAgeFilter,
  matchesCity,
  matchesDateFilter,
  matchesSearch,
} from "./candidates.utils";
import { FilterState } from "./components/candidate-filters/types";

export class CandidateService {
  readonly store = inject(DashboardStore);

  // Filter signals
  readonly searchTerm = signal("");
  readonly statusFilter = signal("all");
  readonly cityFilter = signal("all");
  readonly ageFilter = signal("all");
  readonly dateFilter = signal("all");

  readonly loading = this.store.isLoading;
  readonly candidates = this.store.candidates;
  readonly totalCandidates = this.store.totalCandidates;

  // Computed filter state
  readonly filters = computed(
    (): FilterState => ({
      searchTerm: this.searchTerm(),
      statusFilter: this.statusFilter(),
      cityFilter: this.cityFilter(),
      ageFilter: this.ageFilter(),
      dateFilter: this.dateFilter(),
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
        matchesDateFilter(candidate.registeredAt.toDate(), filters.date),
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
  };
}
