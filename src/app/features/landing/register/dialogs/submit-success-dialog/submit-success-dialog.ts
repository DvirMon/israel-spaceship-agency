import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckbox, MatCheckboxModule } from "@angular/material/checkbox";

export type SubmitSuccessMode = "create" | "update";

export interface SubmitSuccessDialogData {
  fullName: string;
  mode: SubmitSuccessMode;
  expiresAt?: Date;
}
@Component({
  selector: "app-submit-success-dialog",
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    DatePipe,
  ],
  templateUrl: "./submit-success-dialog.html",
  styleUrl: "./submit-success-dialog.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitSuccessDialog {
  private readonly data = inject<SubmitSuccessDialogData>(MAT_DIALOG_DATA);

  private readonly dialogRef = inject(MatDialogRef<SubmitSuccessDialog>);

  readonly checkbox = viewChild(MatCheckbox);

  readonly mode = signal(this.data.mode);

  readonly fullName = signal(this.data.fullName);
  readonly isEditMode = computed(() => this.mode() === "update");
  readonly isCreateMode = computed(() => this.mode() === "create");

  readonly expiresAt = signal(this.data.expiresAt);

  readonly title = computed(() =>
    this.isCreateMode() ? "Registration Successful!" : "Update Saved!"
  );

  readonly subtitle = computed(() =>
    this.isCreateMode()
      ? "for registering to the IISa Program!"
      : "your changes have been saved successfully."
  );

}
