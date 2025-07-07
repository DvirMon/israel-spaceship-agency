import { ChangeDetectionStrategy, Component, computed } from "@angular/core";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatStep, MatStepper, MatStepperNext } from "@angular/material/stepper";
import { isMobile } from "../../utils/utils";
import { PersonalInfo } from "./components/personal-info/personal-info";
import { createPersonalInfoForm } from "./utils/form";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";

const importMaterial = [
  MatStepper,
  MatStep,
  MatStepperNext,
  MatCard,
  MatCardContent,
  MatButton,
  MatIcon,
];

const importComponents = [PersonalInfo];
@Component({
  selector: "app-register",
  imports: [importMaterial, importComponents],
  templateUrl: "./register.html",
  styleUrl: "./register.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  private readonly isMobile = isMobile();

  readonly stepperOrientation = computed(() =>
    this.isMobile() ? "vertical" : "horizontal"
  );

  readonly personalInfoForm = createPersonalInfoForm();
}
