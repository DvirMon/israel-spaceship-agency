import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
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
import { FileUpload } from "app/shared/file-upload/file-upload";
import { CandidateForm } from "./models/register.model";
import { createRegistrationForm } from "./utils/form";
import { RegisterService } from "./services/register.service";
import { RegisterStore } from "./services/register-store";
import { RegisterHttp } from "./services/register-http";

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
  imports: [ReactiveFormsModule, importMaterial, FileUpload],
  templateUrl: "./register.html",
  styleUrl: "./register.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RegisterService, RegisterStore, RegisterHttp],
})
export class Register {
  // Computed signal for dynamic button label

  private readonly registerService = inject(RegisterService);

  candidate = signal<null | CandidateForm>(null);

  readonly submitButtonLabel = computed(() => {
    const candidate = this.candidate();
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

  onCityInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedCity = inputElement?.value || "";
    this.selectedCity.set(selectedCity);
  }

  onCitySelect(event: any) {
    const selectedCity = event.option.value;
    this.selectedCity.set(selectedCity);
  }

  onCandidateSubmit() {
    // if (!this.registerForm.valid) return;

    const formValue = this.registerForm.getRawValue();

    const registrationData = {
      ...formValue,
      age: Number(formValue.age),
      profileImage: formValue.profileImage || null,
    };

    this.registerService.store.candidate.update((current) => {
      if (!current) {
        return registrationData;
      }

      return {
        ...current,
        ...registrationData,
      };
    });
  }
}
