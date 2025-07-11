import { inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { take, timer } from "rxjs";
import { RegisterDialog } from "../register-dialog/register-dialog";
import { RegisterHttp } from "./register-http";
import { RegisterStore } from "./register-store";

@Injectable()
export class RegisterService {
  readonly store = inject(RegisterStore);
  readonly http = inject(RegisterHttp);

  private readonly dialog = inject(MatDialog);

  openDialog(userName: string): void {
    const dialogRef = this.dialog.open(RegisterDialog, {
      width: "500px",
      maxWidth: "95vw",
      panelClass: "success-dialog-panel",
      data: { userName },
    });

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
