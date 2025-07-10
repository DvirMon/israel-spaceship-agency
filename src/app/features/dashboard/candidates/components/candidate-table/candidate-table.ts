import { NgOptimizedImage } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { CandidateStore } from "@core/models/candidate-store.model";
import { ViewMode } from "../../candidates";
import { DaysAgoPipe } from "@shared/pipes/days-ago.pipe";

@Component({
  selector: "app-candidate-table",
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    NgOptimizedImage,
    DaysAgoPipe,
  ],
  templateUrl: "./candidate-table.html",
  styleUrl: "./candidate-table.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateTable {
  readonly candidates = input.required<CandidateStore[]>();
  readonly loading = input(false);
  readonly showExpandedDetails = input(true);
  readonly stickyHeader = input(true);
  readonly viewMode = input<ViewMode>("table");
  readonly candidateView = output<CandidateStore>();
  readonly rowClick = output<CandidateStore>();

  readonly displayedColumns: string[] = [
    "candidate",
    "contact",
    "location",
    "applied",
    "actions",
  ];
  readonly expandedCandidate = signal<CandidateStore | null>(null);

  onViewClick(candidate: CandidateStore): void {
    this.candidateView.emit(candidate);
  }

  onRowClick(candidate: CandidateStore): void {
    if (this.showExpandedDetails()) {
      this.toggle(candidate);
    }
    this.rowClick.emit(candidate);
  }

  /** Toggles the expanded state of an element. */
  toggle(element: CandidateStore) {
    this.expandedCandidate.set(this.compare(element) ? null : element);
  }

  // TrackBy function for performance
  trackByCandidate(index: number, candidate: CandidateStore) {
    return candidate.id;
  }

  /** Checks whether an element is expanded. */
  compare(element: CandidateStore) {
    const expanded = this.expandedCandidate();
    if (!expanded) return false;
    return expanded.id === element.id;
  }
}
