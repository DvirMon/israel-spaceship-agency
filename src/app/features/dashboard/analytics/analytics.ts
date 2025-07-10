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
import { DashboardService } from "../dashboard.service";
import { StatCard } from "./stats-grid/stats-card/types";
import { StatsGrid } from "./stats-grid/stats-grid";
import { VisitData } from "./types";

@Component({
  selector: "app-analytics",
  imports: [MatCardModule, MatIconModule, NgxChartsModule, StatsGrid],
  templateUrl: "./analytics.html",
  styleUrl: "./analytics.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Analytics {
  private readonly dashboardService = inject(DashboardService);

  readonly visitsData = signal<VisitData[]>([]);
  readonly statsLoading = signal(false);
  readonly totalVisits = computed(() =>
    this.visitsData().reduce((sum, day) => sum + day.visits, 0)
  );
  readonly totalRegistrations = computed(() =>
    this.visitsData().reduce((sum, day) => sum + day.registrations, 0)
  );
  readonly conversionRate = computed(() => {
    const visits = this.totalVisits();
    const registrations = this.totalRegistrations();
    return visits > 0 ? Number(((registrations / visits) * 100).toFixed(1)) : 0;
  });

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
      value: this.totalVisits().toLocaleString(),
      subtitle: "Last 7 days",
      gradient: "green",
    },
    {
      title: "Registrations",
      icon: "how_to_reg",
      value: this.totalRegistrations(),
      subtitle: `Conversion: ${this.conversionRate()}%`,
      gradient: "purple",
    },
  ]);
}
