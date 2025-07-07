import { ChangeDetectionStrategy, Component, computed } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatStep, MatStepper } from "@angular/material/stepper";
import { isMobile } from "../../utils/utils";
@Component({
  selector: "app-register",
  imports: [MatStepper, MatStep, MatCardModule],
  templateUrl: "./register.html",
  styleUrl: "./register.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  private readonly isMobile = isMobile();

  readonly stepperOrientation = computed(() =>
    this.isMobile() ? "vertical" : "horizontal"
  );
}
