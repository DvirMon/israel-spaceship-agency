import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import {
  AdditionalInfoModel,
  PersonalInfoModel,
} from "../../models/register.model";

@Component({
  selector: "app-review-step",
  imports: [MatCardModule],
  templateUrl: "./review-step.html",
  styleUrl: "./review-step.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewStep {
  additionalInfo = input.required<Partial<AdditionalInfoModel>>();

  personalInfo = input.required<Partial<PersonalInfoModel>>();

  previewImage = computed(
    () => this.additionalInfo().profileImage?.name || null
  );
}
