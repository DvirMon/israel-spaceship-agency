import { inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subject, switchMap, take, timer } from "rxjs";
import { ExpiredNoticeDialog } from "../dialogs/expired-notice-dialog/expired-notice-dialog";
import { RegisterDialog } from "../dialogs/register-dialog/register-dialog";
import { RegisterHttp } from "./register.http";
import { RegisterStore } from "./register.store";

@Injectable()
export class RegisterService {
  readonly store = inject(RegisterStore);
  readonly http = inject(RegisterHttp);

  private readonly dialog = inject(MatDialog);

  private readonly closeAnimation$ = new Subject<RegisterDialog>();

  private readonly closingDialogEffect$ = this.closeAnimation$.pipe(
    take(1),
    switchMap(() => timer(3000))
  );

  constructor() {
    this.closingDialogEffect$.subscribe(() => {
      this.dialog.closeAll();
    });
  }

  openSuccessDialog(userName: string): void {
    const dialogRef = this.dialog.open(RegisterDialog, {
      width: "500px",
      maxWidth: "95vw",
      panelClass: "success-dialog-panel",
      data: { userName },
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
