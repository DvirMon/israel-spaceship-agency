import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Renderer2,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { timer, take } from "rxjs";

@Component({
  selector: "app-register-dialog",
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: "./register-dialog.html",
  styleUrl: "./register-dialog.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterDialog {
  // Use inject function for modern Angular dependency injection
  public dialogRef = inject(MatDialogRef<RegisterDialog>);
  public data = inject(MAT_DIALOG_DATA);
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);

  private isClosing = false;

  onClose(): void {
    this.animateClose();
  }

  private animateClose(): void {
    if (this.isClosing) return;

    this.isClosing = true;

    // Add closing class to trigger CSS animation using Renderer2
    this.renderer.addClass(this.elementRef.nativeElement, "closing");

    // Close the dialog after animation completes using RxJS timer (300ms matches CSS transition)
    timer(300)
      .pipe(take(1))
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  // Method to be called externally for programmatic close with animation
  closeWithAnimation(): void {
    this.animateClose();
  }
}
