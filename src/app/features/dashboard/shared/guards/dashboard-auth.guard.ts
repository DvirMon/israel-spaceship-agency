import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { DashboardAuthService } from "../services/dashboard-auth.service";

export const dashboardAuthGuard: CanActivateFn = () => {
  return inject(DashboardAuthService).checkAccess();
};
