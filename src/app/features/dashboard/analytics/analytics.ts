import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { AnalyticsService } from "./analytics.service";
import { StatCard } from "./stats-grid/stats-card/types";
import { StatsGrid } from "./stats-grid/stats-grid";
import { VisitData } from "./types";
import { DashboardService } from "../dashboard.service";

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

  readonly visitsData = signal<VisitData[]>([]);
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
}
