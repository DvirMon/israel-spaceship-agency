import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  linkedSignal
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function optionIncludedValidator<T>(validOptions: T[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const isValid = validOptions.includes(value);
    return isValid ? null : { optionNotIncluded: true };
  };
}

@Component({
  selector: "app-city-autocomplete",
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  templateUrl: "./city-autocomplete.html",
  styleUrl: "./city-autocomplete.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityAutocomplete {
  readonly control = input.required<FormControl>();

  readonly options = input.required<string[]>();

  readonly selectedCity = linkedSignal(() => this.control().value);

  readonly filterOptions = linkedSignal({
    source: this.selectedCity,
    computation: (city) => {
      if (!city) return this.options();

      if (typeof city !== "string") {
        return this.options();
      }

      return this.options().filter((option) =>
        option.toLowerCase().trim().includes(city.toLowerCase().trim())
      );
    },
  });

  constructor() {
    effect(() => {
      const control = this.control();
      const options = this.options();

      if (control && options.length > 0) {
        this.control().addValidators(optionIncludedValidator(options));
        this.control().updateValueAndValidity();
      }
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
