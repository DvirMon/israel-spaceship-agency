import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";

export type SubmitSuccessMode = "create" | "update";

export interface SuccessSubmitDialogData {
  fullName: string;
  mode: SubmitSuccessMode;
  editableUntil?: Date;
}
@Component({
  selector: "app-submit-success-dialog",
  imports: [MatDialogModule, MatButtonModule, MatIconModule, DatePipe],
  templateUrl: "./submit-success-dialog.html",
  styleUrl: "./submit-success-dialog.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitSuccessDialog {
  private readonly data = inject<SuccessSubmitDialogData>(MAT_DIALOG_DATA);

  readonly mode = signal(this.data.mode);

  readonly fullName = signal(this.data.fullName);
  readonly isEditMode = computed(() => this.mode() === "update");
  readonly isCreateMode = computed(() => this.mode() === "create");

  readonly editableUntil = signal(this.data.editableUntil);

  readonly title = computed(() =>
    this.isCreateMode() ? "Registration Successful!" : "Update Saved!"
  );

  readonly subtitle = computed(() =>
    this.isCreateMode()
      ? "for registering to the IISa Program!"
      : "your changes have been saved successfully."
  );
}
