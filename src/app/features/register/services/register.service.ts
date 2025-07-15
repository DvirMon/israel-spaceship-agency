import { inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ExpiredNoticeDialog } from "../dialogs/expired-notice-dialog/expired-notice-dialog";
import {
  SubmitSuccessDialog,
  SubmitSuccessDialogData,
} from "../dialogs/submit-success-dialog/submit-success-dialog";
import { RegisterHttp } from "./register.http";
import { RegisterStore } from "./register.store";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class RegisterService {
  private readonly snackBar = inject(MatSnackBar);

  readonly store = inject(RegisterStore);
  readonly http = inject(RegisterHttp);

  private readonly dialog = inject(MatDialog);
  openSuccessDialog(data: SubmitSuccessDialogData) {
    return this.dialog.open(SubmitSuccessDialog, {
      width: "580px",
      maxHeight: "700px",
      minHeight: "560px",
      disableClose: true,
      maxWidth: "95vw",
      panelClass: "success-dialog-panel",
      data,
    });
  }

  openExpiredDialog(): void {
    this.dialog.open(ExpiredNoticeDialog, {
      width: "500px",
      disableClose: true,
      maxWidth: "95vw",
      panelClass: "expired-dialog-panel",
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 3000,
      horizontalPosition: "center",
      verticalPosition: "bottom",
    });
  }
}
