import { Component, input } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: "app-loading-overlay",
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="overlay-container">
      <ng-content></ng-content>
      @if(loading()) {

      <div class="overlay-spinner">
        <mat-spinner [diameter]="diameter()"></mat-spinner>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .overlay-container {
        position: relative;
      }

      .overlay-spinner {
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
        pointer-events: all;
      }
    `,
  ],
})
export class LoadingOverlay {
  readonly loading = input<boolean>(false);
  readonly diameter = input<number>(40);
}
