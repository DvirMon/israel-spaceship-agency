import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
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
import { filter, map, withLatestFrom } from "rxjs";

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

  private readonly submitEvent$ = this.form.events.pipe(
    filter(
      (event): event is FormSubmittedEvent =>
        event instanceof FormSubmittedEvent
    ),
    withLatestFrom(this.form.controls.password.statusChanges),
    map(([_, value]) => value)
  );

  private readonly submitValue$ = this.submitEvent$.pipe(
    map((value) => value === "VALID")
  );

  readonly remainingAttempts = computed(() => MAX_ATTEMPTS - this.attempts());

  constructor() {
    this.submitValue$.pipe(takeUntilDestroyed()).subscribe((value) => {
      if (value) {
        this.dialogRef.close(this.form.controls.password.value);
        return;
      }

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
