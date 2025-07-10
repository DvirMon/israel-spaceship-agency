import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { StatCard } from "./types";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

export interface StatCardData {
  title: string;
  icon: string;
  value: string | number;
  subtitle: string;
  gradient: "blue" | "green" | "purple" | "orange";
}

@Component({
  selector: "app-stats-card",
  imports: [MatCardModule, MatIconModule],
  templateUrl: "./stats-card.html",
  styleUrl: "./stats-card.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsCard {
  readonly data = input.required<StatCard>();
}
