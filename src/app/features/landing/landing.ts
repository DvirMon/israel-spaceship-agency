import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { take, timer } from "rxjs";
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
  readonly registerComponent = viewChild("register", { read: ElementRef<Register> });

  readonly scrollToEffect = timer(2000).pipe(take(1));

  constructor() {
    this.scrollToEffect.subscribe(() => {
      const register = this.registerComponent();

      if (register) {
        register.nativeElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  }
}
