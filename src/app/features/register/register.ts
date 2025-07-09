import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
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
import { FileUpload } from "app/shared/components/file-upload/file-upload";
import { LoadingOverlay } from "app/shared/components/loading-overlay/loading-overlay";
import { LoadingOverlayService } from "app/shared/components/loading-overlay/loading-overlay.service";
import {
  filter,
  switchMap,
  tap
} from "rxjs";
import { RegisterHttp } from "./services/register-http";
import { RegisterStore } from "./services/register-store";
import { RegisterService } from "./services/register.service";
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
];

const CITY_OPTIONS = [
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
  imports: [ReactiveFormsModule, importMaterial, FileUpload, LoadingOverlay],
  templateUrl: "./register.html",
  styleUrl: "./register.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RegisterService, RegisterStore, RegisterHttp],
})
export class Register {
  // Computed signal for dynamic button label

  private readonly registerService = inject(RegisterService);

  readonly isLoading = inject(LoadingOverlayService).isLoading

  readonly submitButtonLabel = computed(() => {
    const candidate = this.registerService.store.candidate();
    return candidate === null ? "Save & Submit" : "Save & Update";
  });

  readonly registerForm = createRegistrationForm();

  readonly selectedCity = linkedSignal(
    () => this.registerForm.controls.city.value
  );

  readonly cityOptions = linkedSignal({
    source: this.selectedCity,
    computation: (city) => {
      if (!city) return CITY_OPTIONS;
      return CITY_OPTIONS.filter((option) =>
        option.toLowerCase().includes(city.toLowerCase())
      );
    },
  });

  readonly updateCandidateEffect$ = formSubmitEffect(this.registerForm).pipe(
    filter(() => this.registerService.store.isUpdateFlow()),
    tap(() => console.log('update')),
    switchMap((value) => this.registerService.http.updateCandidate(value))
  );
  
  readonly createCandidateEffect$ = formSubmitEffect(this.registerForm).pipe(
    filter(() => !this.registerService.store.isUpdateFlow()),
    tap(() => console.log('create')),
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

  onCityInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedCity = inputElement?.value || "";
    this.selectedCity.set(selectedCity);
  }

  onCitySelect(event: any) {
    const selectedCity = event.option.value;
    this.selectedCity.set(selectedCity);
  }
}
