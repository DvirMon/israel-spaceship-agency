import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { NgxChartsModule, ScaleType } from "@swimlane/ngx-charts";
import { AnalyticsService } from "./analytics.service";
import { StatCard } from "./stats-grid/stats-card/types";
import { StatsGrid } from "./stats-grid/stats-grid";
import { VisitData } from "./types";
import { DashboardService } from "../dashboard.service";
import { chartView } from "../overview/utils";
import { Breakpoints } from "@angular/cdk/layout";

@Component({
  selector: "app-analytics",
  imports: [MatCardModule, MatIconModule, NgxChartsModule, StatsGrid],
  templateUrl: "./analytics.html",
  styleUrl: "./analytics.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Analytics {
  private readonly dashboardService = inject(DashboardService);
  private readonly analyticsService = inject(AnalyticsService);
  readonly visitsData = signal<VisitData[]>(this.getVisitsData());
  readonly statsLoading = signal(false);
  readonly totalVisits = computed(() =>
    this.visitsData().reduce((sum, day) => sum + day.visits, 0)
  );
  readonly totalRegistrations = computed(() =>
    this.visitsData().reduce((sum, day) => sum + day.registrations, 0)
  );
  readonly conversionRate = this.analyticsService.conversionRate;
  readonly analytics = this.analyticsService.analytics;

  readonly isLoading = this.analyticsService.isLoading;

  readonly statCards = computed((): StatCard[] => [
    {
      title: "Total Candidates",
      icon: "people",
      value: this.dashboardService.totalCandidates(),
      subtitle: "+12% from last week",
      gradient: "blue",
    },
    {
      title: "Total Visits",
      icon: "visibility",
      value: this.analyticsService.visitsCount(),
      subtitle: "Current total",
      gradient: "green",
    },
    {
      title: "Registrations",
      icon: "how_to_reg",
      value: this.analyticsService.registerCount(),
      subtitle: `Conversion: ${this.conversionRate()}%`,
      gradient: "purple",
    },
  ]);

  readonly results = computed(() => {
    return [
      {
        name: "Visits",
        series: this.visitsData().map((d) => ({
          name: d.date,
          value: d.visits,
        })),
      },
      {
        name: "Registrations",
        series: this.visitsData().map((d) => ({
          name: d.date,
          value: d.registrations,
        })),
      },
    ];
  });

  readonly colorScheme = {
    name: "customScheme",
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ["#2196F3", "#4CAF50", "#FF9800", "#F44336", "#9C27B0", "#00BCD4"],
  };

  readonly chartViewState = chartView();

  getVisitsData(): VisitData[] {
    return [
      { date: "Jan 1", visits: 120, registrations: 15 },
      { date: "Jan 2", visits: 150, registrations: 22 },
      { date: "Jan 3", visits: 180, registrations: 28 },
      { date: "Jan 4", visits: 200, registrations: 35 },
      { date: "Jan 5", visits: 250, registrations: 45 },
      { date: "Jan 6", visits: 300, registrations: 52 },
      { date: "Jan 7", visits: 280, registrations: 48 },
    ];
  }
}
