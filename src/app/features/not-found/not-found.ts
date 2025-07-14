import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-not-found",
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="not-found-container">
      <mat-icon class="error-icon">error_outline</mat-icon>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  `,
  styles: [
    `
      .not-found-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
        background: #1e1e1e;
        color: #ffffff;
        padding: 2rem;
      }

      .error-icon {
        font-size: 64px;
        height: 64px;
        width: 64px;
        color: #bb86fc;
        margin-bottom: 1rem;
      }

      h1 {
        margin-bottom: 1rem;
        color: #bb86fc;
      }

      p {
        margin-bottom: 2rem;
        max-width: 400px;
        line-height: 1.6;
      }

    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {}
