import { animate, style, transition, trigger } from "@angular/animations";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from "@angular/core";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { IS_MOBILE } from "@core/tokens/mobile";
import { CITY_OPTIONS } from "app/features/register/register";
import { ViewMode } from "../../candidates";
import { ActiveFilter, FilterState } from "./types";
import { getCityLabel, getDateLabel, getSortLabel } from "./utils";
// import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: "app-candidate-filters",
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButton,
    MatIcon,
    MatIconButton,
    MatChipsModule,
    MatTooltipModule,
    MatButtonToggleModule,
  ],
  templateUrl: "./candidate-filters.html",
  styleUrls: ["./candidate-filters.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("slideDown", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(-10px)" }),
        animate(
          "200ms ease-out",
          style({ opacity: 1, transform: "translateY(0)" })
        ),
      ]),
      transition(":leave", [
        animate(
          "200ms ease-in",
          style({ opacity: 0, transform: "translateY(-10px)" })
        ),
      ]),
    ]),
  ],
})
export class CandidateFilters {
  readonly isMobile = inject(IS_MOBILE);
  readonly filters = input.required<FilterState>();
  readonly viewMode = input.required<ViewMode>();
  readonly resultCount = input.required<number>();
  readonly totalCount = input.required<number>();

  readonly cityOptions = input<string[]>(CITY_OPTIONS);
  readonly loading = input(false);
  readonly showAdvancedFilters = model(false);
  readonly searchChange = model<string>();
  readonly statusFilterChange = model<string>();
  readonly cityFilterChange = model<string>();
  readonly ageFilterChange = model<string>();
  readonly dateFilterChange = model<string>();
  readonly sortChange = model<string>();
  readonly toggleView = output<ViewMode>();
  readonly removeFilter = output<keyof FilterState>();
  readonly clearFilters = output<void>();
  // Computed active filters
  readonly activeFilters = computed(() => {
    const filters = this.filters();
    const active: ActiveFilter[] = [];

    if (filters.searchTerm) {
      active.push({
        key: "searchTerm",
        label: `Search: "${filters.searchTerm}"`,
        icon: "search",
      });
    }

    if (filters.cityFilter !== "all") {
      active.push({
        key: "cityFilter",
        label: `City: ${getCityLabel(filters.cityFilter)}`,
        icon: "place",
      });
    }

    if (filters.ageFilter !== "all") {
      active.push({
        key: "ageFilter",
        label: `Age: ${filters.ageFilter}`,
        icon: "cake",
      });
    }

    if (filters.dateFilter !== "all") {
      active.push({
        key: "dateFilter",
        label: `Date: ${getDateLabel(filters.dateFilter)}`,
        icon: "schedule",
      });
    }

    if (filters.sortBy !== "name") {
      active.push({
        key: "sortBy",
        label: `Sort: ${getSortLabel(filters.sortBy)}`,
        icon: "sort",
      });
    }

    return active;
  });

  // Computed has active filters
  readonly hasActiveFilters = computed((): boolean => {
    const filters = this.filters();
    return (
      filters.searchTerm !== "" ||
      filters.statusFilter !== "all" ||
      filters.cityFilter !== "all" ||
      filters.ageFilter !== "all" ||
      filters.dateFilter !== "all" ||
      filters.sortBy !== "name"
    );
  });

  onSearchChange(event: Event): void {
    const eventTarget = event.target as HTMLInputElement;
    const value = eventTarget.value.trim();
    this.searchChange.set(value);
  }

  onStatusFilterChange(value: string): void {
    this.statusFilterChange.set(value);
  }

  onCityFilterChange(value: string): void {
    this.cityFilterChange.set(value);
  }

  onAgeFilterChange(value: string): void {
    this.ageFilterChange.set(value);
  }

  onDateFilterChange(value: string): void {
    this.dateFilterChange.set(value);
  }

  onSortChange(value: string): void {
    this.sortChange.set(value);
  }

  onToggleView(mode: ViewMode): void {
    this.toggleView.emit(mode);
  }

  onClearFilters(): void {
    this.clearFilters.emit();
  }

  onRemoveFilter(key: keyof FilterState): void {
    this.removeFilter.emit(key);
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters.update((show) => !show);
  }

  // TrackBy function for performance
  trackByFilter(index: number, filter: ActiveFilter): string {
    return `${filter.key}-${filter.label}`;
  }
}
