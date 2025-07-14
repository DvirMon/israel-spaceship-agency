import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormSubmittedEvent,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { filter, tap, withLatestFrom, map } from "rxjs";

const MAX_ATTEMPTS = 3;

@Component({
  selector: "app-admin-access-dialog",
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./admin-access.dialog.html",
  styleUrl: "./admin-access.dialog.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAccessDialog {
  private readonly dialogRef = inject(MatDialogRef<AdminAccessDialog>);
  private readonly attempts = signal(0);

  readonly form = new FormGroup({
    password: new FormControl("", [
      Validators.required,
      Validators.pattern(/^admin$/i),
    ]),
  });

  readonly controlSubmitEffect = this.form.events.pipe(
    filter(
      (event): event is FormSubmittedEvent =>
        event instanceof FormSubmittedEvent
    ),
    tap(() => console.log(this.form.controls.password.value)),
    withLatestFrom(this.form.controls.password.statusChanges),
    map(([_, value]) => value)
  );

  readonly remainingAttempts = computed(() => MAX_ATTEMPTS - this.attempts());

  constructor() {
    this.controlSubmitEffect.subscribe((value) => {
      if (value === "VALID") {
        this.dialogRef.close(this.form.controls.password.value);
        return;
      }

      console.log(this.attempts());
      this.attempts.update((count) => count + 1);
      this.form.reset();
    });
  }

  readonly noAttemptsEffect = effect(() => {
    if (this.remainingAttempts() === 0) {
      this.dialogRef.close(undefined);
    }
  });
}