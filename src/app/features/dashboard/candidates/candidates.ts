import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";

export type ViewMode = "list" | "table";

const materialImports = [MatCardModule, MatIconModule, MatDialogModule];

@Component({
  selector: "app-candidates",
  imports: [materialImports],
  templateUrl: "./candidates.html",
  styleUrl: "./candidates.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Candidates {
  readonly viewMode = signal<ViewMode>("list");
}
