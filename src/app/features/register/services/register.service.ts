import { inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { timer, take } from "rxjs";
import { RegisterDialog } from "../components/register-dialog/register-dialog";
import { RegisterStore } from "./register-store";

@Injectable()
export class RegisterService {
  private readonly dialog = inject(MatDialog);

  readonly store = inject(RegisterStore);

  openDialog(userName: string): void {
    const dialogRef = this.dialog.open(RegisterDialog, {
      width: "500px",
      maxWidth: "95vw",
      panelClass: "success-dialog-panel",
      data: { userName },
    });

    // Auto-close dialog after 3 seconds using RxJS timer
    timer(3000)
      .pipe(take(1))
      .subscribe(() => {
        // Use the component's animation method for smooth close
        const componentInstance = dialogRef.componentInstance;
        componentInstance.closeWithAnimation();
      });

    dialogRef.afterClosed().subscribe(() => {
      // Optionally reset the form or navigate somewhere
      console.log("Success dialog closed");
    });
  }
}
