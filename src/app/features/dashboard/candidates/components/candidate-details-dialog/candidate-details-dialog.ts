import { DatePipe, NgOptimizedImage } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { CandidateStore } from "@core/models/candidate.model";
import { TimestampToDatePipe } from "@shared/pipes/date-to-timestamp.pipe";
import { DaysAgoPipe } from "@shared/pipes/days-ago.pipe";

@Component({
  selector: "app-candidate-details-dialog",
  imports: [
    MatDialogModule,
    NgOptimizedImage,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    DatePipe,
    DaysAgoPipe,
    TimestampToDatePipe,
  ],
  templateUrl: "./candidate-details-dialog.html",
  styleUrl: "./candidate-details-dialog.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateDetailsDialog {
  private readonly data = inject<{
    id: string;
    candidates: CandidateStore[];
  }>(MAT_DIALOG_DATA);

  readonly candidatesList = computed(() => this.data.candidates);
  readonly currentIndex = linkedSignal(() =>
    this.candidatesList().findIndex((c) => c.id === this.data.id)
  );

  readonly candidate = computed(() => {
    const candidates = this.candidatesList();
    const idx = this.currentIndex();
    return candidates[idx] ?? null;
  });

  goToNextCandidate(): void {
    const idx = this.currentIndex();
    if (idx < this.candidatesList().length - 1) {
      this.currentIndex.set(idx + 1);
    }
  }

  goToPreviousCandidate(): void {
    const idx = this.currentIndex();
    if (idx > 0) {
      this.currentIndex.set(idx - 1);
    }
  }
}
