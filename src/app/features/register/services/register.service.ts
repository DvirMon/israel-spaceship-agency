import { inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subject, switchMap, take, timer } from "rxjs";
import { ExpiredNoticeDialog } from "../dialogs/expired-notice-dialog/expired-notice-dialog";
import {
  SubmitSuccessDialog,
  SuccessSubmitDialogData,
} from "../dialogs/submit-success-dialog/submit-success-dialog";
import { RegisterHttp } from "./register.http";
import { RegisterStore } from "./register.store";

@Injectable()
export class RegisterService {
  readonly store = inject(RegisterStore);
  readonly http = inject(RegisterHttp);

  private readonly dialog = inject(MatDialog);
  openSuccessDialog(data: SuccessSubmitDialogData) {
    return this.dialog.open(SubmitSuccessDialog, {
      width: "580px",
      maxHeight: "670px",
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
}
