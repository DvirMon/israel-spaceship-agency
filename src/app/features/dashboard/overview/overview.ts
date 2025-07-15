import { Breakpoints } from "@angular/cdk/layout";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { groupToChartData } from "@core/charts/utils";
import { CandidateStore } from "@core/models/candidate.model";
import { NgxChartsModule, ScaleType } from "@swimlane/ngx-charts";
import { DashboardStore } from "../dashboard.service";
import { LocationMap } from "./location-map/location-map";
import { chartView } from "./utils";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Component({
  selector: "app-overview",
  imports: [MatCardModule, NgxChartsModule, LocationMap, MatProgressSpinner],
  templateUrl: "./overview.html",
  styleUrl: "./overview.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overview {
  private readonly store = inject(DashboardStore);

  readonly candidates = this.store.candidates;
  readonly isLoading = this.store.isLoading;

  readonly chartViewState = chartView([
    Breakpoints.Medium,
    Breakpoints.Small, // ≥ 600px
  ]);

  readonly colorScheme = {
    name: "customScheme",
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ["#810081"],
  };

  readonly ageResults = computed(() =>
    groupToChartData(this.candidates(), this.groupByAge)
  );
  readonly cityResults = computed(() =>
    groupToChartData(this.candidates(), this.groupByCity)
  );

  readonly locationCoordinates = computed(() =>
    this.candidates().map((c) => ({
      lat: c.geo.latitude,
      lng: c.geo.longitude,
    }))
  );

  formatTicks = (value: number): string => {
    return Number.isInteger(value) ? value.toString() : "";
  };

  groupByAge = (item: CandidateStore) => {
    const age = item.age;
    if (age <= 25) return "20–25";
    if (age <= 30) return "26–30";
    if (age <= 35) return "31–35";
    if (age <= 40) return "36–40";
    return "41+";
  };
  groupByCity = (item: { city?: string }) => item.city ?? "Unknown";
}
