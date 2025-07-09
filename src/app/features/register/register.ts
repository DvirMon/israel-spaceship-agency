import {
  ChangeDetectionStrategy,
  Component,
  computed,
  linkedSignal,
  signal,
} from "@angular/core";
import {
  MatButton,
  MatButtonModule,
  MatIconButton,
} from "@angular/material/button";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import {
  MatStep,
  MatStepper,
  MatStepperModule,
  MatStepperNext,
  MatStepperPrevious,
} from "@angular/material/stepper";
import { isMobile } from "../../utils/utils";
import { AdditionalInfo } from "./components/additional-info/additional-info";
import { PersonalInfo } from "./components/personal-info/personal-info";
import { ReviewStep } from "./components/review-step/review-step";
import {
  createAdditionalInfoForm,
  createPersonalInfoForm,
  createRegistrationForm,
} from "./utils/form";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCardModule } from "@angular/material/card";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ReactiveFormsModule } from "@angular/forms";
import { CITY_OPTIONS } from "./components/personal-info/mock";
import { CandidateForm } from "./models/register.model";
import { FileUpload } from "app/shared/file-upload/file-upload";

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

// const importComponents = [PersonalInfo, AdditionalInfo, ReviewStep];
@Component({
  selector: "app-register",
  imports: [ReactiveFormsModule, importMaterial, FileUpload],
  templateUrl: "./register.html",
  styleUrl: "./register.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  // Computed signal for dynamic button label

  candidate = signal<null | CandidateForm>(null);

  readonly submitButtonLabel = computed(() => {
    const candidate = this.candidate();
    return candidate === null ? "Save & Submit" : "Save & Update";
  });

  readonly registrationForm = createRegistrationForm();


  readonly selectedCity = linkedSignal(
    () => this.registrationForm.controls.city.value
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

  onCandidateSubmit() {}
}
