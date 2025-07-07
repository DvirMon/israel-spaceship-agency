import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatStepper } from "@angular/material/stepper";

const coreImports = [ReactiveFormsModule];

const importMaterial = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatSelectModule,
];
@Component({
  selector: "app-personal-info",
  imports: [coreImports, importMaterial],
  templateUrl: "./personal-info.html",
  styleUrl: "./personal-info.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalInfo {
  readonly form = input.required<FormGroup>();

  
}
