import { DatePipe, NgOptimizedImage } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { CandidateStore } from "@core/models/candidate.model";
import { ViewMode } from "../../candidates";
import { DaysAgoPipe } from "@shared/pipes/days-ago.pipe";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
@Component({
  selector: "app-candidate-table",
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    NgOptimizedImage,
    DatePipe,
    DaysAgoPipe,
  ],
  templateUrl: "./candidate-table.html",
  styleUrl: "./candidate-table.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
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
  // readonly expandedCandidate = computed(() => this.candidates()[0]);

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
