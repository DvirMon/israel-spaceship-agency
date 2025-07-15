import { Route } from "@angular/router";
import { DashboardStore } from "./dashboard.service";
import { dashboardAuthGuard } from "./shared/guards/dashboard-auth.guard";

export const DASHBOARD_ROUTES: Route = {
  path: "admin",
  loadComponent: () => import("./dashboard").then((m) => m.Dashboard),
  providers: [DashboardStore],
  canActivate: [dashboardAuthGuard],
};
