import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { AgeChart } from "app/shared/components/age-chart/age-chart";
import { ChartData, DashboardService } from "../dashboard.service";

@Component({
  selector: "app-overview",
  imports: [MatCardModule, AgeChart],
  templateUrl: "./overview.html",
  styleUrl: "./overview.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overview {
  private readonly dashboardService = inject(DashboardService);

  ageData = signal<ChartData[]>(this.dashboardService.getAgeData());
  // locationData = signal<LocationData[]>(
  //   this.dashboardService.getLocationData()
}
