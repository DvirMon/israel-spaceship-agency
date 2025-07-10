import { DatePipe, NgOptimizedImage } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { CandidateStore } from "@core/models/candidate-store.model";

@Component({
  selector: "app-candidate-card",
  standalone: true,
  imports: [NgOptimizedImage, MatCardModule, MatIconModule, MatChipsModule, DatePipe],
  templateUrl: "./candidate-card.html",
  styleUrls: ["./candidate-card.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateCard {
  readonly candidate = input.required<CandidateStore>();
  readonly loading = input(false);
  readonly showActions = input(false);
  readonly cardClick = output<CandidateStore>();
  readonly actionClick = output<{
    candidate: CandidateStore;
    action: string;
  }>();

  onCardClick(): void {
    if (!this.loading()) {
      this.cardClick.emit(this.candidate());
    }
  }

  onActionClick(action: string, event: Event): void {
    event.stopPropagation();
    this.actionClick.emit({ candidate: this.candidate(), action });
  }
}
