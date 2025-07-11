import { inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subject, switchMap, take, timer } from "rxjs";
import { ExpiredNoticeDialog } from "../dialogs/expired-notice-dialog/expired-notice-dialog";
import { SubmitSuccessDialog, SuccessSubmitDialogData } from "../dialogs/submit-success-dialog/submit-success-dialog";
import { RegisterHttp } from "./register.http";
import { RegisterStore } from "./register.store";

@Injectable()
export class RegisterService {
  readonly store = inject(RegisterStore);
  readonly http = inject(RegisterHttp);

  private readonly dialog = inject(MatDialog);

  private readonly closeAnimation$ = new Subject<SubmitSuccessDialog>();

  private readonly closingDialogEffect$ = this.closeAnimation$.pipe(
    take(1),
    switchMap(() => timer(3000))
  );

  constructor() {
    this.closingDialogEffect$.subscribe(() => {
      this.dialog.closeAll();
    });
  }

  openSuccessDialog(data :  SuccessSubmitDialogData): void {
    const dialogRef = this.dialog.open(SubmitSuccessDialog, {
      width: "550px",
      maxWidth: "95vw",
      panelClass: "success-dialog-panel",
      data,
    });

    this.closeAnimation$.next(dialogRef.componentInstance);
  }

  openExpiredDialog() {
    this.dialog.open(ExpiredNoticeDialog, {
      width: "500px",
      disableClose: true,
      maxWidth: "95vw",
      panelClass: "expired-dialog-panel",
    });
  }
}
