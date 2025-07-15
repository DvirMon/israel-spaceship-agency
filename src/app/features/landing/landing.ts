import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  isDevMode,
  viewChild,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { map, take, timer } from "rxjs";
import { Register } from "./register/register";
import { withLogDailyVisit } from "./utils";
import { Hero } from "./hero/hero";

const importMaterial = [MatIconModule, MatButtonModule];

const importComponents = [Hero, Register];

@Component({
  selector: "app-landing",
  imports: [importMaterial, importComponents],
  templateUrl: "./landing.html",
  styleUrl: "./landing.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing {
  readonly registerComponent = viewChild.required(Register, {
    read: ElementRef,
  });

  readonly delayEvent = toSignal(
    timer(3500).pipe(
      take(1),
      map(() => true)
    )
  );

  readonly logDailyVisit$ = timer(5000).pipe(withLogDailyVisit());

  readonly scrollToEffect = effect(() => {
    const register = this.registerComponent();
    const delayEvent = this.delayEvent();
    if (delayEvent && register) {
      register.nativeElement.scrollIntoView({
        behavior: "smooth",
      });
    }
  });

  constructor() {
    if (isDevMode()) {
      console.log("Landing");
    }
    this.logDailyVisit$.subscribe();
  }
}
