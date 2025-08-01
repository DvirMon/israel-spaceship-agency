import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { provideCollectionToken } from "@core/tokens/collection.tokens";
import { CityAutocomplete } from "app/shared/components/city-autocomplete/city-autocomplete";
import { FileUpload } from "app/shared/components/file-upload/file-upload";
import { LoadingOverlay } from "app/shared/components/loading-overlay/loading-overlay";
import { LoadingOverlayService } from "app/shared/components/loading-overlay/loading-overlay.service";

import { toSignal } from "@angular/core/rxjs-interop";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { Subject, switchMap } from "rxjs";
import {
  SubmitSuccessDialog,
  SubmitSuccessDialogData,
} from "./dialogs/submit-success-dialog/submit-success-dialog";
import { RegisterHttp } from "./services/register.http";
import { RegisterService } from "./services/register.service";
import { RegisterStore } from "./services/register.store";
import { createCandidateEvent, isNothingChangedEvent, updateCandidateEvent } from "./utils/effects";
import { createRegistrationForm, formSubmitEffect } from "./utils/form";

const importMaterial = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCardModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatSnackBarModule,
];

export const CITY_OPTIONS = [
  "Jerusalem",
  "Tel Aviv",
  "Haifa",
  "Rishon LeZion",
  "Petah Tikva",
  "Ashdod",
  "Netanya",
  "Beer Sheva",
  "Bnei Brak",
  "Holon",
  "Ramat Gan",
  "Rehovot",
  "Bat Yam",
  "Ashkelon",
  "Herzliya",
  "Kfar Saba",
  "Hadera",
  "Modiin",
  "Lod",
  "Nazareth",
  "Ramla",
  "Ra’anana",
  "Givatayim",
  "Nahariya",
  "Acre",
  "Eilat",
  "Tiberias",
  "Kiryat Gat",
  "Kiryat Motzkin",
  "Yavne",
];

// const importComponents = [PersonalInfo, AdditionalInfo, ReviewStep];
@Component({
  selector: "app-register",
  imports: [
    ReactiveFormsModule,
    importMaterial,
    FileUpload,
    LoadingOverlay,
    CityAutocomplete,
  ],
  templateUrl: "./register.html",
  styleUrl: "./register.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideCollectionToken("candidates"),
    RegisterService,
    RegisterStore,
    RegisterHttp,
  ],
})
export class Register {
  private readonly registerService = inject(RegisterService);

  readonly isLoading = inject(LoadingOverlayService).isLoading;
  readonly registerForm = createRegistrationForm();
  readonly cityOptions = CITY_OPTIONS;

  readonly dialogCloseSource = new Subject<
    MatDialogRef<SubmitSuccessDialog, boolean>
  >();


  readonly shouldShowSnackBar = isNothingChangedEvent(this.registerForm);

  readonly submitButtonLabel = computed(() => {
    const candidate = this.registerService.store.candidate();
    return candidate === null ? "Save & Submit" : "Save & Update";
  });

  readonly submitRegisterEvent$ = formSubmitEffect(this.registerForm);
  readonly createCandidate = createCandidateEvent(this.submitRegisterEvent$);
  readonly updateCandidate = updateCandidateEvent(this.submitRegisterEvent$);

  readonly editExpiredEffect = effect(() => {
    const hasEditExpired = this.registerService.store.hasEditExpired();
    if (hasEditExpired) {
      this.registerService.openExpiredDialog();
    }
  });

  readonly updateFormEffect = effect(() => {
    const existingCandidate = this.registerService.store.storeCandidate();
    if (existingCandidate) {
      this.registerForm.patchValue(existingCandidate);
    }
  });

  readonly createCandidateEffect = effect(() => {
    const value = this.createCandidate();

    if (!value) return;

    this.registerService.store.candidate.set(value);

    this.registerService.openSuccessDialog({
      fullName: value.fullName,
      mode: "create",
      expiresAt: value.expiresAt.toDate(),
    });

    this.registerForm.markAsPristine();
  });

  readonly existingCandidateCandidateEffect = effect(() => {
    const value = this.updateCandidate();

    if (!value) return;

    this.registerService.store.candidate.set(value);

    this.registerForm.markAsPristine();

    this.registerService.openSuccessDialog({
      fullName: value.fullName,
      mode: "create",
      expiresAt: value.expiresAt.toDate(),
    });
  });

  readonly snackBarEffect = effect(() => {
    if (this.shouldShowSnackBar()) {
      this.registerService.openSnackBar(
        "Nothing to update – you haven’t changed anything yet"
      );
    }
  });
}
