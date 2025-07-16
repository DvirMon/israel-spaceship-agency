import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { DashboardAuth } from "../services/dashboard-auth.service";

export const dashboardAuthGuard: CanActivateFn = () => {
  return inject(DashboardAuth).checkAccess();
};
