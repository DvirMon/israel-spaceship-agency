import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { NgxChartsModule } from "@swimlane/ngx-charts";

@Component({
  selector: "app-analytics",
  imports: [MatCardModule, MatIconModule, NgxChartsModule],
  templateUrl: "./analytics.html",
  styleUrl: "./analytics.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Analytics {}
