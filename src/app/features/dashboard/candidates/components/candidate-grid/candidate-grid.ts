import { animate, style, transition, trigger } from "@angular/animations";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { CandidateStore } from "@core/models/candidate.model";
import { ViewMode } from "../../candidates";
import { CandidateCard } from "../candidate-card/candidate-card";

@Component({
  selector: "app-candidate-grid",
  imports: [MatIconModule, MatButtonModule, MatCardModule, CandidateCard],
  templateUrl: "./candidate-grid.html",
  styleUrl: "./candidate-grid.scss",
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
export class CandidateGrid {
  readonly candidates = input.required<CandidateStore[]>();
  readonly loading = input(false);
  readonly cardLoading = input(false);
  readonly showActions = input(false);
  readonly columns = input<number | "auto">("auto");
  readonly gap = input<"small" | "medium" | "large">("medium");
  readonly viewMode = input<ViewMode>("grid");

  readonly candidateClick = output<CandidateStore>();
  readonly actionClick = output<{
    candidate: CandidateStore;
    action: string;
  }>();
  readonly clearFilters = output<void>();

  onCandidateClick(candidate: CandidateStore): void {
    this.candidateClick.emit(candidate);
  }

  onActionClick(event: { candidate: CandidateStore; action: string }): void {
    this.actionClick.emit(event);
  }

  onClearFilters(): void {
    this.clearFilters.emit();
  }

  trackByCandidate(index: number, candidate: CandidateStore) {
    return candidate.id;
  }
}
