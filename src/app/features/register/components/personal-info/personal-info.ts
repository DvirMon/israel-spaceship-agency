import {
  ChangeDetectionStrategy,
  Component,
  input,
  linkedSignal
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CITY_OPTIONS } from "./mock";
import { PersonalInfoForm } from "../../models/register.model";

const coreImports = [ReactiveFormsModule];

const importMaterial = [
  MatFormFieldModule,
  MatInputModule,
  MatAutocompleteModule,
];


@Component({
  selector: "app-personal-info",
  imports: [coreImports, importMaterial],
  templateUrl: "./personal-info.html",
  styleUrl: "./personal-info.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalInfo {
  readonly form = input.required<PersonalInfoForm>();

  readonly selectedCity = linkedSignal(() => this.form().controls.city.value);

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
}
