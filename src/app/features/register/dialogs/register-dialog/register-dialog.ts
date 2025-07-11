import {
  ChangeDetectionStrategy,
  Component,
  inject
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogModule
} from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-register-dialog",
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: "./register-dialog.html",
  styleUrl: "./register-dialog.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterDialog {
  // Use inject function for modern Angular dependency injection
  public data = inject(MAT_DIALOG_DATA);
  
}
