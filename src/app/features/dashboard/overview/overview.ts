import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { groupToChartData } from "@core/charts/utils";
import { CandidateStore } from "@core/models/candidate-store.model";
import { NgxChartsModule, ScaleType } from "@swimlane/ngx-charts";
import { DashboardService } from "../dashboard.service";
import { LocationMap } from "./location-map/location-map";

@Component({
  selector: "app-overview",
  imports: [MatCardModule, NgxChartsModule, LocationMap],
  templateUrl: "./overview.html",
  styleUrl: "./overview.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overview {
  private readonly dashboardService = inject(DashboardService);

  readonly candidates = this.dashboardService.data;

  readonly colorScheme = {
    name: "customScheme",
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ["#2196F3", "#4CAF50", "#FF9800", "#F44336", "#9C27B0", "#00BCD4"],
  };

  readonly ageResults = computed(() =>
    groupToChartData(this.candidates(), this.groupByAge)
  );
  readonly cityResults = computed(() =>
    groupToChartData(this.candidates(), this.groupByCity)
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
