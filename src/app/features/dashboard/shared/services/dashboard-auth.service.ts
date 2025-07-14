import { Injectable, inject, signal } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, map, tap } from "rxjs";
import { AdminAccessDialog } from "../dialogs/admin-access/admin-access.dialog";
import { toObservable } from "@angular/core/rxjs-interop";

@Injectable({ providedIn: "root" })
export class DashboardAuthService {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  readonly isAuthenticated = signal<boolean>(false);

  checkAccess(): Observable<boolean> {
    if (this.isAuthenticated()) {
      return toObservable(this.isAuthenticated);
    }

    return this.dialog
      .open(AdminAccessDialog, { disableClose: true })
      .afterClosed()
      .pipe(
        map((result) => {
          const isAuthenticated = this.validatePassword(result);
          this.isAuthenticated.set(isAuthenticated);

          if (!isAuthenticated) {
            this.router.navigate(["not-found"]);
          }

          return isAuthenticated;
        })
      );
  }

  private validatePassword(password: string | undefined): boolean {
    if (!password) return false;
    return password.toLowerCase().trim() === "admin";
  }
}
