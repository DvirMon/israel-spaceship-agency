import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
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
import { CandidateStore } from "@core/models/candidate-store.model";
import { provideCollectionToken } from "@core/tokens/collection.tokens";
import { CityAutocomplete } from "app/shared/components/city-autocomplete/city-autocomplete";
import { FileUpload } from "app/shared/components/file-upload/file-upload";
import { LoadingOverlay } from "app/shared/components/loading-overlay/loading-overlay";
import { LoadingOverlayService } from "app/shared/components/loading-overlay/loading-overlay.service";

import { withTimestamps } from "@shared/operators";
import { filter, map, switchMap, tap } from "rxjs";
import { CandidateForm } from "./models/register.model";
import { RegisterHttp } from "./services/register.http";
import { RegisterStore } from "./services/register.store";
import { RegisterService } from "./services/register.service";
import {
  createRegistrationForm,
  fileToUrl,
  formSubmitEffect,
} from "./utils/form";
import { compareCandidates, withCoordinates } from "./utils/utils";

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
  // Computed signal for dynamic button label

  private readonly registerService = inject(RegisterService);

  readonly isLoading = inject(LoadingOverlayService).isLoading;

  readonly submitButtonLabel = computed(() => {
    const candidate = this.registerService.store.candidate();
    return candidate === null ? "Save & Submit" : "Save & Update";
  });

  readonly registerForm = createRegistrationForm();

  readonly cityOptions = CITY_OPTIONS;

  readonly updateCandidateEffect$ = formSubmitEffect(this.registerForm).pipe(
    filter(() => this.registerService.store.isUpdateFlow()),
    tap((val) => console.log("update", val)),
    fileToUrl("profileImage"),
    filter(
      (value) =>
        !compareCandidates(value, this.registerService.store.candidate())
    ),
    map(
      (value) =>
        ({
          ...this.registerService.store.candidate(),
          ...value,
        } as CandidateStore)
    ),
    withCoordinates("city"),
    switchMap((value) => this.registerService.http.updateCandidate(value))
  );

  readonly createCandidateEffect$ = formSubmitEffect(this.registerForm).pipe(
    filter(() => !this.registerService.store.isUpdateFlow()),
    map((value) => ({ ...value } as CandidateForm)),
    fileToUrl("profileImage"),
    withCoordinates("city"),
    withTimestamps(),
    tap((value) => console.log("create", value)),

    // TODO: solve with mergeMap to able using withLoadingOverlay
    switchMap((value) => this.registerService.http.createCandidate(value))
  );

  readonly updateCandidateEffect = toSignal(this.updateCandidateEffect$);
  readonly createCandidateEffect = toSignal(this.createCandidateEffect$);

  constructor() {
    effect(() => {
      const existingCandidate = this.registerService.store.candidate();
      if (existingCandidate) {
        this.registerForm.patchValue(existingCandidate);
      }
    });

    effect(() => {
      const value = this.createCandidateEffect();

      if (!value) return;

      this.registerService.store.candidate.set(value);
      this.registerService.openDialog(value.fullName);
    });
  }
}
