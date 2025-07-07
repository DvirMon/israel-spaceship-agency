import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Register } from "../register/register";

const importMaterial = [MatIconModule, MatButtonModule];

const importComponents = [Register];

@Component({
  selector: "app-landing",
  imports: [importMaterial, importComponents],
  templateUrl: "./landing.html",
  styleUrl: "./landing.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing {
  registerComponent = viewChild("registerComponent", {
    read: ElementRef,
  });

  onScrollToRegistration() {
    // Scroll to registration section
    const regComponent = this.registerComponent();
    if (regComponent) {
      regComponent.nativeElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      // If component not loaded yet, scroll to where it will be
      const placeholder = document.querySelector(
        ".registration-placeholder, .registration-loading"
      );
      if (placeholder) {
        placeholder.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }
}
