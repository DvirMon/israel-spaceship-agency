import { inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { filter, of, switchMap, take, tap, timer } from "rxjs";
import { RegisterDialog } from "../components/register-dialog/register-dialog";
import { CandidateForm } from "../models/register.model";
import { RegisterHttp } from "./register-http";
import { RegisterStore } from "./register-store";
import { CandidateStore } from "@core/models/candidate-store.model";

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
