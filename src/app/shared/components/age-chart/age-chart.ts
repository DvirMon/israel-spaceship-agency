import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ChartData } from "app/features/dashboard/dashboard.service";
import { Color, NgxChartsModule, ScaleType } from "@swimlane/ngx-charts";

@Component({
  selector: "app-age-chart",
  imports: [NgxChartsModule],
  templateUrl: "./age-chart.html",
  styleUrl: "./age-chart.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgeChart {
  readonly data = input.required<ChartData[]>();
  readonly colorScheme = input<Color>({
    name: "customScheme",
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ["#2196F3", "#4CAF50", "#FF9800", "#F44336", "#9C27B0", "#00BCD4"],
  });

  readonly select = output<any>();
  readonly activate = output<any>();
  readonly deactivate = output<any>();

  onSelect(event: any): void {
    this.select.emit(event);
  }

  onActivate(event: any): void {
    this.activate.emit(event);
  }

  onDeactivate(event: any): void {
    this.deactivate.emit(event);
  }
}
