import {
  ChangeDetectionStrategy,
  Component,
  computed
} from "@angular/core";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import {
  MatStep,
  MatStepper,
  MatStepperNext,
  MatStepperPrevious,
} from "@angular/material/stepper";
import { isMobile } from "../../utils/utils";
import { AdditionalInfo } from "./components/additional-info/additional-info";
import { PersonalInfo } from "./components/personal-info/personal-info";
import { ReviewStep } from "./components/review-step/review-step";
import { createAdditionalInfoForm, createPersonalInfoForm } from "./utils/form";

const importMaterial = [
  MatStepper,
  MatStep,
  MatStepperNext,
  MatStepperPrevious,
  MatIconButton,
  MatButton,
  MatIcon,
];

const importComponents = [PersonalInfo, AdditionalInfo, ReviewStep];
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

  readonly additionalInfoForm = createAdditionalInfoForm();


  // TODO: Add effect to auto next when step is valid

  onCandidateSubmit() {}
}
