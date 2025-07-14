import { Route } from "@angular/router";
import { DashboardService } from "./dashboard.service";
import { dashboardAuthGuard } from "./shared/guards/dashboard-auth.guard";

export const DASHBOARD_ROUTES: Route = {
  path: "dashboard",
  loadComponent: () => import("./dashboard").then((m) => m.Dashboard),
  providers: [DashboardService],
  canActivate: [dashboardAuthGuard],
};
