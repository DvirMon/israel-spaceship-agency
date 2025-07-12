import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { StatsCard } from "./stats-card/stats-card";
import { StatCard } from "./stats-card/types";
import { trigger, transition, style, animate } from "@angular/animations";

@Component({
  selector: "app-stats-grid",
  imports: [MatIconModule, StatsCard],
  templateUrl: "./stats-grid.html",
  styleUrl: "./stats-grid.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
    trigger("slideIn", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(20px)" }),
        animate(
          "300ms ease-out",
          style({ opacity: 1, transform: "translateY(0)" })
        ),
      ]),
    ]),
  ],
})
export class StatsGrid {
  readonly statCards = input.required<StatCard[]>();
  readonly loading = input(false);
  readonly columns = input<number | "auto">("auto");
  readonly gap = input<"small" | "medium" | "large">("medium");

  readonly cardClick = output<StatCard>();
  readonly cardHover = output<StatCard>();

  trackByStatCard(index: number, card: StatCard): string {
    return `${card.title}-${card.value}`;
  }

  onCardClick(card: StatCard): void {
    this.cardClick.emit(card);
  }

  onCardHover(card: StatCard): void {
    this.cardHover.emit(card);
  }
}
