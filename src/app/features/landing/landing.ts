import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  viewChild
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { map, take, timer } from "rxjs";
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
  readonly registerComponent = viewChild("register", {
    read: ElementRef<Register>,
  });

  readonly delayEvent = toSignal(
    timer(2000).pipe(
      take(1),
      map(() => true)
    )
  );

  readonly scrollToEffect = effect(() => {
    const register = this.registerComponent();
    const delayEvent = this.delayEvent();
    if (delayEvent && register) {
      register.nativeElement.scrollIntoView({
        behavior: "smooth",
      });
    }
  });

}
