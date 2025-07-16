import { Injectable, inject, isDevMode, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Observable, map, of } from "rxjs";
import { AdminAccessDialog } from "../dialogs/admin-access/admin-access.dialog";

@Injectable({ providedIn: "root" })
export class DashboardAuth {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  readonly isAuthenticated = signal<boolean>(false);

  checkAccess(): Observable<boolean> {
    if (this.isAuthenticated()) {
      return toObservable(this.isAuthenticated);
    }

    if (isDevMode()) return of(true);

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
