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
        <mat-spinner diameter="40"></mat-spinner>
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
  // TODO: try linkedSignal with input and and service data
  loading = input<boolean>(false);

  // isLoading = link
}
